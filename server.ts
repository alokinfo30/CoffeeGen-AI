import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Modality } from '@google/genai';
import { MENU_ITEMS } from './server/menuData';
import { CUSTOMER_PROFILES } from './server/profilesData';
import { ragEngine } from './server/ragEngine';
import { baristaAgent } from './server/adkAgent';
import { OrderDraft } from './src/types';
import {
  setSecurityHeadersMiddleware,
  InputSanitizer,
  RateLimiter,
  CartSecurityValidator,
  PromptGuard
} from './server/security';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Security Headers (CSP, HSTS, X-Content-Type, X-Frame-Options)
  app.use(setSecurityHeadersMiddleware);

  // 2. Strict Payload Limits & Anti-Prototype Pollution Sanitization
  app.use(express.json({ limit: '100kb' }));
  app.use(InputSanitizer.sanitizePayloadMiddleware);

  // 3. Start periodic rate limiter table cleanup
  RateLimiter.startCleanup();

  // API Routes

  // 1. Health check & security diagnostics
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Roast & Reason Coffee ADK Agent (Cloud Run)',
      runtime: 'Node.js + Express + Vite',
      security: {
        promptGuard: 'active',
        rateLimiter: 'active (sliding-window)',
        antiTamperCart: 'active',
        sanitizer: 'active'
      },
      timestamp: new Date().toISOString()
    });
  });

  // 2. Menu items
  app.get('/api/menu', RateLimiter.middleware('global'), (req: Request, res: Response) => {
    res.json({
      items: MENU_ITEMS,
      categories: ['espresso', 'pour-over', 'cold-brew', 'tea-matcha', 'seasonal', 'bakery', 'savory']
    });
  });

  // 3. Customer profiles
  app.get('/api/profiles', RateLimiter.middleware('global'), (req: Request, res: Response) => {
    res.json({
      profiles: CUSTOMER_PROFILES
    });
  });

  // 4. ADK Agent Chat & Recommendation Loop with PromptGuard & Rate Limiting
  app.post('/api/agent/chat', RateLimiter.middleware('chat'), async (req: Request, res: Response) => {
    try {
      const { message, customerProfileId, customProfileData, environmentContext, conversationHistory } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Valid message string is required' });
      }

      if (message.length > 1000) {
        return res.status(400).json({ error: 'Message exceeds maximum allowable length (1000 chars)' });
      }

      const agentResult = await baristaAgent.executeAgent({
        message,
        customerProfileId: customerProfileId || 'alex-morgan',
        customProfileData,
        environmentContext: environmentContext || {
          timeOfDay: 'afternoon',
          weather: 'crisp_sunny',
          temperature: '68°F',
          storeStatus: 'open',
          baristaDailySpecial: 'Iced Honey Cinnamon Oat Latte + Vegan Banana Loaf Pairing'
        },
        conversationHistory
      });

      res.json(agentResult);
    } catch (error: any) {
      console.error('Agent chat error:', error);
      res.status(500).json({
        error: 'Failed to process ADK agent request',
        details: error?.message || String(error)
      });
    }
  });

  // 5. RAG Direct Semantic Search with Query Sanitization
  app.post('/api/rag/search', RateLimiter.middleware('global'), (req: Request, res: Response) => {
    try {
      const { query, topK, excludeAllergens, maxCaffeine, customerProfile } = req.body;
      const cleanQuery = typeof query === 'string' ? query.slice(0, 300) : '';
      
      const results = ragEngine.search(cleanQuery, {
        topK: Math.min(10, Math.max(1, Number(topK) || 4)),
        excludeAllergens: Array.isArray(excludeAllergens) ? excludeAllergens : undefined,
        maxCaffeine: typeof maxCaffeine === 'number' ? maxCaffeine : undefined,
        customerProfile
      });
      res.json({ results });
    } catch (error: any) {
      console.error('RAG search error:', error);
      res.status(500).json({ error: 'RAG search failed' });
    }
  });

  // 6. RAG Knowledge Base inspection
  app.get('/api/rag/knowledge', RateLimiter.middleware('global'), (req: Request, res: Response) => {
    res.json({
      documents: ragEngine.getAllChunks(),
      totalChunks: ragEngine.getAllChunks().length
    });
  });

  // 7. Order Submission with Authoritative Server-Side Price Verification & Anti-Tamper
  app.post('/api/order/submit', RateLimiter.middleware('global'), (req: Request, res: Response) => {
    try {
      const validation = CartSecurityValidator.validateAndComputeOrder(req.body);

      if (!validation.isValid || !validation.order) {
        return res.status(400).json({
          success: false,
          error: 'Order validation failed',
          details: validation.errors
        });
      }

      res.json({
        success: true,
        order: validation.order,
        message: `Order #${validation.order.id} verified & confirmed! Barista is preparing your handcrafted order.`
      });
    } catch (error: any) {
      console.error('Order submission error:', error);
      res.status(500).json({ error: 'Failed to submit order' });
    }
  });

  // Helper to wrap raw PCM audio in a valid WAV header container
function wrapPcmInWav(pcmBase64: string, sampleRate = 24000, numChannels = 1, bitDepth = 16): string {
  const pcmBuffer = Buffer.from(pcmBase64, 'base64');
  if (pcmBuffer.length > 4 && pcmBuffer.toString('utf8', 0, 4) === 'RIFF') {
    return pcmBase64;
  }

  const byteRate = (sampleRate * numChannels * bitDepth) / 8;
  const blockAlign = (numChannels * bitDepth) / 8;
  const dataSize = pcmBuffer.length;
  const header = Buffer.alloc(44);

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitDepth, 34);
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]).toString('base64');
}

// 8. Gemini Text-To-Speech (TTS) for Barista Voice with Rate Limiter
app.post('/api/tts', RateLimiter.middleware('chat'), async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text string is required' });
    }

    const cleanText = text.replace(/<[^>]*>/g, '').slice(0, 250);

    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const ttsResponse = await ai.models.generateContent({
        model: 'gemini-3.1-flash-tts-preview',
        contents: [{ parts: [{ text: `Say warmly and cheerfully like a specialty coffee barista: ${cleanText}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' } // Warm barista voice
            }
          }
        }
      });

      const rawAudio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (rawAudio) {
        const wavAudio = wrapPcmInWav(rawAudio, 24000);
        return res.json({ success: true, base64Audio: wavAudio, mimeType: 'audio/wav' });
      }
    }

    // If no key or no audio returned, instruct client to use Web Speech API
    res.json({ success: false, fallback: true });
  } catch (error: any) {
    console.warn('TTS generation failed, falling back to Web Speech:', error?.message);
    res.json({ success: false, fallback: true });
  }
});

  // Vite Middleware integration for development vs production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`☕ Roast & Reason Coffee ADK Agent running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
