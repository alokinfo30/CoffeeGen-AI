/**
 * Roast & Reason Coffee Lab - Enterprise Security & Defense Layer
 * 
 * Provides defense-in-depth security:
 * 1. AI Prompt Injection & Adversarial Jailbreak Defense (PromptGuard)
 * 2. Sliding-Window Token Bucket Rate Limiting (Anti-DDoS & Bot Mitigation)
 * 3. Authoritative Server-Side Price Verification & Anti-Tampering
 * 4. Input Sanitization & Anti-Prototype Pollution Protection
 * 5. HTTP Security Headers (CSP, HSTS, X-Content-Type, Referrer)
 */

import { Request, Response, NextFunction } from 'express';
import { MENU_ITEMS } from './menuData';
import { CartItem, MenuItem, OrderDraft } from '../src/types';

// ==========================================
// 1. PROMPT INJECTION & JAILBREAK DEFENSE
// ==========================================

const ADVERSARIAL_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|directives|rules)/i,
  /you\s+are\s+now\s+(in\s+)?(dan|developer|unrestricted|jailbreak|root|admin)\s+mode/i,
  /system\s*(:\s*|override|prompt|directive)/i,
  /<\s*system\s*>/i,
  /<\s*\/?im_start\s*>/i,
  /reveal\s+(your\s+)?(system\s+prompt|hidden\s+instructions|api\s*key|secret|gemini_api_key)/i,
  /gemini_api_key/i,
  /disregard\s+the\s+safety\s+guidelines/i,
  /act\s+as\s+an\s+unrestricted\s+ai/i,
  /roleplay\s+as\s+a\s+hacker/i,
  /bypass\s+all\s+content\s+filters/i,
  /forget\s+all\s+your\s+rules/i,
  /base64\s+decode/i,
  /repeat\s+everything\s+above/i
];

export interface PromptScanResult {
  isSafe: boolean;
  sanitizedText: string;
  threatLevel: 'none' | 'low' | 'medium' | 'high';
  detectedThreats: string[];
}

export class PromptGuard {
  /**
   * Scans and sanitizes user input before passing it to LLM
   */
  public static scan(input: string): PromptScanResult {
    if (!input || typeof input !== 'string') {
      return { isSafe: true, sanitizedText: '', threatLevel: 'none', detectedThreats: [] };
    }

    const detectedThreats: string[] = [];
    let threatScore = 0;

    // Check for adversarial prompt injection patterns
    for (const pattern of ADVERSARIAL_PATTERNS) {
      if (pattern.test(input)) {
        detectedThreats.push(`Matched adversarial pattern: ${pattern.source}`);
        threatScore += 3;
      }
    }

    // Check for special token injection attempts
    if (input.includes('```system') || input.includes('```admin') || input.includes('<<SYS>>')) {
      detectedThreats.push('System marker injection attempted');
      threatScore += 3;
    }

    // Check for zero-width characters and obfuscation
    const hasZeroWidth = /[\u200B-\u200D\uFEFF]/.test(input);
    if (hasZeroWidth) {
      detectedThreats.push('Zero-width unicode obfuscation detected');
      threatScore += 2;
    }

    // Strip dangerous tags and zero-width characters
    let sanitized = input
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<\/?(system|instruction|prompt|secret|im_start|im_end)[^>]*>/gi, '')
      .trim();

    // Limit maximum length to prevent context flooding
    if (sanitized.length > 1000) {
      sanitized = sanitized.slice(0, 1000);
      detectedThreats.push('Input truncated (exceeded 1000 char limit)');
    }

    let threatLevel: 'none' | 'low' | 'medium' | 'high' = 'none';
    if (threatScore >= 6) threatLevel = 'high';
    else if (threatScore >= 3) threatLevel = 'medium';
    else if (threatScore > 0) threatLevel = 'low';

    return {
      isSafe: threatLevel !== 'high',
      sanitizedText: sanitized,
      threatLevel,
      detectedThreats
    };
  }

  /**
   * Enforces XML instruction isolation boundary tags for LLM prompts
   */
  public static wrapInBoundary(userInput: string): string {
    const clean = userInput.replace(/<\/?user_query>/g, '');
    return `<user_query>\n${clean}\n</user_query>`;
  }

  /**
   * Output filter: Ensures model does not leak sensitive internal system artifacts
   */
  public static sanitizeModelOutput(output: string): string {
    if (!output) return '';
    return output
      .replace(/AIza[0-9A-Za-z-_]{35}/g, '[REDACTED_API_KEY]')
      .replace(/GEMINI_API_KEY/g, '[CONFIG_VAR]')
      .replace(/<user_query>|<\/user_query>/gi, '')
      .trim();
  }
}

// ==========================================
// 2. SLIDING-WINDOW RATE LIMITER
// ==========================================

interface ClientRateRecord {
  timestamps: number[];
}

export class RateLimiter {
  private static store = new Map<string, ClientRateRecord>();
  private static readonly WINDOW_MS = 60 * 1000; // 1 minute
  private static readonly MAX_REQUESTS_CHAT = 30; // 30 agent requests/min
  private static readonly MAX_REQUESTS_GLOBAL = 120; // 120 general requests/min

  public static middleware(type: 'chat' | 'global' = 'global') {
    return (req: Request, res: Response, next: NextFunction) => {
      const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
      const key = `${ip}:${type}`;
      const now = Date.now();
      const limit = type === 'chat' ? RateLimiter.MAX_REQUESTS_CHAT : RateLimiter.MAX_REQUESTS_GLOBAL;

      let record = RateLimiter.store.get(key);
      if (!record) {
        record = { timestamps: [] };
        RateLimiter.store.set(key, record);
      }

      // Filter out timestamps outside the sliding window
      record.timestamps = record.timestamps.filter(t => now - t < RateLimiter.WINDOW_MS);

      if (record.timestamps.length >= limit) {
        const oldest = record.timestamps[0];
        const retryAfterSec = Math.ceil((RateLimiter.WINDOW_MS - (now - oldest)) / 1000);
        res.setHeader('Retry-After', retryAfterSec.toString());
        return res.status(429).json({
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Please retry after ${retryAfterSec} seconds.`,
          retryAfter: retryAfterSec
        });
      }

      record.timestamps.push(now);
      next();
    };
  }

  // Periodic cleanup of stale rate records
  public static startCleanup(intervalMs = 5 * 60 * 1000) {
    setInterval(() => {
      const now = Date.now();
      for (const [key, record] of RateLimiter.store.entries()) {
        record.timestamps = record.timestamps.filter(t => now - t < RateLimiter.WINDOW_MS);
        if (record.timestamps.length === 0) {
          RateLimiter.store.delete(key);
        }
      }
    }, intervalMs);
  }
}

// ==========================================
// 3. AUTHORITATIVE PRICE VERIFICATION & ANTI-TAMPER
// ==========================================

export interface ValidatedOrderResult {
  isValid: boolean;
  order?: OrderDraft;
  errors: string[];
}

export class CartSecurityValidator {
  private static readonly TAX_RATE = 0.085; // 8.5% sales tax

  /**
   * Recalculates cart prices authoritatively against server-side source of truth.
   * Prevents client-side price tampering, negative quantities, discount injection, and NaN values.
   */
  public static validateAndComputeOrder(payload: any): ValidatedOrderResult {
    const errors: string[] = [];

    if (!payload || typeof payload !== 'object') {
      return { isValid: false, errors: ['Invalid order payload'] };
    }

    const { customerId, customerName, items, notes } = payload;

    if (!Array.isArray(items) || items.length === 0) {
      return { isValid: false, errors: ['Order must contain at least one item'] };
    }

    if (items.length > 50) {
      return { isValid: false, errors: ['Order exceeds maximum allowable items (50)'] };
    }

    let calculatedSubtotal = 0;
    const validatedItems: CartItem[] = [];

    for (let i = 0; i < items.length; i++) {
      const clientItem = items[i];
      if (!clientItem || !clientItem.menuItem || !clientItem.menuItem.id) {
        errors.push(`Item #${i + 1} is missing valid menu item reference`);
        continue;
      }

      // Lookup real menu item in database
      const canonicalItem = MENU_ITEMS.find(m => m.id === clientItem.menuItem.id);
      if (!canonicalItem) {
        errors.push(`Invalid menu item ID: ${clientItem.menuItem.id}`);
        continue;
      }

      // Validate integer quantity
      const quantity = Math.floor(Number(clientItem.quantity));
      if (isNaN(quantity) || quantity < 1 || quantity > 20) {
        errors.push(`Invalid quantity for ${canonicalItem.name}: must be an integer between 1 and 20`);
        continue;
      }

      // Calculate unit price based on customizations
      let unitPrice = canonicalItem.price;
      const custom = clientItem.customization || {};

      // Size adjustments
      if (custom.size === 'Large (16oz)') unitPrice += 0.75;
      else if (custom.size === 'Extra Large (20oz)') unitPrice += 1.25;

      // Alternative milk adjustments
      if (custom.milk && !custom.milk.includes('Default') && !custom.milk.includes('Whole')) {
        unitPrice += 0.60;
      }

      // Extra espresso shots ($0.80/shot)
      const extraShots = Math.max(0, Math.min(4, Math.floor(Number(custom.extraShots) || 0)));
      unitPrice += extraShots * 0.80;

      // Syrups ($0.50 each)
      if (Array.isArray(custom.syrups)) {
        unitPrice += custom.syrups.length * 0.50;
      }

      // Add-ons ($0.95 each)
      if (Array.isArray(custom.addOns)) {
        unitPrice += custom.addOns.length * 0.95;
      }

      // Round unit price to cents
      unitPrice = Math.round(unitPrice * 100) / 100;
      const lineTotal = Math.round(unitPrice * quantity * 100) / 100;
      calculatedSubtotal += lineTotal;

      validatedItems.push({
        cartItemId: clientItem.cartItemId || clientItem.id || `cart-item-${Date.now()}-${i}`,
        item: canonicalItem,
        quantity,
        customization: {
          size: custom.size || 'Regular (12oz)',
          temperature: custom.temperature === 'iced' ? 'iced' : 'hot',
          milk: custom.milk || 'Standard',
          sweetness: custom.sweetness || 'Standard',
          syrups: Array.isArray(custom.syrups) ? custom.syrups : [],
          extraShots,
          addOns: Array.isArray(custom.addOns) ? custom.addOns : [],
          specialInstructions: (custom.specialInstructions || '').slice(0, 200)
        },
        unitPrice,
        totalPrice: lineTotal,
        calculatedCalories: canonicalItem.calories,
        calculatedCaffeine: canonicalItem.caffeineMg
      });
    }

    if (errors.length > 0 || validatedItems.length === 0) {
      return { isValid: false, errors };
    }

    calculatedSubtotal = Math.round(calculatedSubtotal * 100) / 100;
    const calculatedTax = Math.round(calculatedSubtotal * CartSecurityValidator.TAX_RATE * 100) / 100;
    const calculatedTotal = Math.round((calculatedSubtotal + calculatedTax) * 100) / 100;
    const pointsEarned = Math.round(calculatedTotal * 10);

    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const sanitizedCustomerName = (customerName || 'Valued Guest').toString().replace(/[<>]/g, '').slice(0, 50);
    const sanitizedNotes = notes ? notes.toString().replace(/[<>]/g, '').slice(0, 300) : undefined;

    const validatedOrder: OrderDraft = {
      id: orderId,
      customerId: (customerId || 'guest').toString().slice(0, 50),
      customerName: sanitizedCustomerName,
      items: validatedItems,
      subtotal: calculatedSubtotal,
      discount: 0,
      tax: calculatedTax,
      total: calculatedTotal,
      pointsEarned,
      status: 'received',
      pickupEstimateMinutes: Math.min(12, 3 + validatedItems.length),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: sanitizedNotes
    };

    return {
      isValid: true,
      order: validatedOrder,
      errors: []
    };
  }
}

// ==========================================
// 4. INPUT SANITIZER & ANTI-PROTOTYPE POLLUTION
// ==========================================

export class InputSanitizer {
  /**
   * Recursive prototype pollution guard
   */
  public static preventPrototypePollution(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => InputSanitizer.preventPrototypePollution(item));
    }

    const safeObj: Record<string, any> = {};
    for (const key of Object.getOwnPropertyNames(obj)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue; // Strip prototype pollution vectors
      }
      safeObj[key] = InputSanitizer.preventPrototypePollution(obj[key]);
    }
    // Explicitly delete dangerous properties to be resilient
    delete (safeObj as any)['__proto__'];
    delete (safeObj as any)['constructor'];
    delete (safeObj as any)['prototype'];
    return safeObj;
  }

  /**
   * Express middleware for global request payload sanitization
   */
  public static sanitizePayloadMiddleware(req: Request, res: Response, next: NextFunction) {
    if (req.body && typeof req.body === 'object') {
      req.body = InputSanitizer.preventPrototypePollution(req.body);
    }
    next();
  }
}

// ==========================================
// 5. SECURITY HEADERS MIDDLEWARE
// ==========================================

export function setSecurityHeadersMiddleware(req: Request, res: Response, next: NextFunction) {
  // Prevent MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Protect against clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
  // Cross-Site Scripting protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Strict Transport Security (HSTS)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // Permissions Policy
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  next();
}
