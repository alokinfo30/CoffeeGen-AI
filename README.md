# ☕ Roast & Reason Coffee Lab — Intelligent Barista Platform

> An enterprise-grade, full-stack specialty coffee application powered by **Agent Development Kit (ADK) multi-stage reasoning**, **Retrieval-Augmented Generation (RAG)**, **Procedural Web Audio Ambient Acoustics**, and **Defense-in-Depth AI Security**.

📚 **[Click Here for the Complete User & Feature Guide (USER_GUIDE.md)](./USER_GUIDE.md)** for step-by-step walkthroughs of every feature.

---

## 🌟 Highlights & Key Features

### 1. 🧠 Multi-Stage ADK Barista Agent
* **Planner & Profile Context Binding**: Dynamically extracts user dietary restrictions, caffeine tolerance (e.g. strict decaf / keto / dairy-free), current weather, time of day, and loyalty tier.
* **Domain-Specific RAG Knowledge Retrieval**: Vector-style semantic cosine similarity search across flavor chemistry, single-origin terroir, brewing science, and dietary guides.
* **Safety & Tool Invocation**: Invokes drink customization validators, allergy safety filters, and price guards before formulating recommendations.
* **Grounded Synthesis**: Leverages Gemini with automated XML boundary isolation and client-side audio playback synthesis (TTS).

### 2. 🛡️ Enterprise Security & Hacker Defense (Unbreakable Defense-in-Depth)
* **`PromptGuard` (AI Injection & Jailbreak Defense)**:
  * Pattern scanning for adversarial inputs (e.g. `"Ignore previous instructions"`, `DAN mode`, `SYSTEM OVERRIDE`, system prompt extraction).
  * XML Tag Boundary Isolation (`<user_query>` wrapping) preventing user instructions from hijacking system prompts.
  * Model Output Sanitization & Credential Redaction (guarantees zero API key leakage).
* **`CartSecurityValidator` (Authoritative Server-Side Pricing)**:
  * Re-calculates and validates every price, size surcharge, alternative milk fee, extra shot, syrup, and tax exclusively on the server.
  * Eliminates client-side price tampering, negative quantity exploits, and `NaN` injection.
* **`InputSanitizer` (Anti-Prototype Pollution)**:
  * Recursive sanitization stripping `__proto__`, `constructor`, and `prototype` vectors from all incoming HTTP JSON bodies.
* **Sliding-Window Rate Limiting**:
  * Per-IP rate limiting (100 requests per 15 minutes for standard routes; 30 requests per minute for LLM/TTS endpoints) mitigating DDoS and brute-force attacks.
* **Hardened Security Headers**:
  * Strict `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection`, `Strict-Transport-Security`, and restrictive `Permissions-Policy`.

### 3. 🎵 Procedural Ambient Soundscapes (Zero-Asset Web Audio API)
* Custom, real-time procedural audio synthesizer built directly on the browser's `AudioContext`.
* 3 immersive acoustic profiles:
  * **Coffee Shop Ambience**: Warm filtered pink noise with resonant steam hiss, portafilter clinks, and café murmur.
  * **Rain on Glass**: Gentle brown-noise rainfall with randomized window raindrop impacts.
  * **Lofi Café Beats**: Relaxing Rhodes-style synth chords, vinyl crackle, and soft hip-hop kick/snare percussion.
* Seamless volume control, mute toggle, and zero external MP3 network dependencies (eliminating 404 audio errors).

### 4. 📊 Customer Loyalty & Real-Time Analytics
* **Loyalty Points Tracker Widget**: Visual progress bar tracking tier advancement (Bronze, Silver, Gold, Coffee Master) and one-click reward redemptions.
* **Weekly Spending & Frequency Sparkline**: Interactive visual analytics chart rendered with Recharts showcasing recent coffee investment trends.
* **"Order Again" Capability**: Instant one-click re-ordering directly from customer order history.
* **Live Order Status Tracker**: Interactive order progress visualizer (Bean Grinding ➔ Extraction ➔ Steaming Milk ➔ Quality Inspection ➔ Ready for Pickup) with canvas celebratory confetti.

### 5. 📱 Fully Responsive Design (Mobile, Laptop, Desktop)
* **Mobile (< 640px)**: Compact header, touch-optimized tab switcher between AI Assistant and Menu Catalog, full-screen slide-over drawer cart. Touch targets minimum 44px.
* **Tablet / Laptop (640px - 1024px)**: Adaptive horizontal persona carousel, dense menu grids, floating cart launcher.
* **Desktop (> 1024px / 1280px)**: Side-by-side dual-column workspace with live ADK telemetry inspection, interactive RAG knowledge browser, and high-density product cards.

---

## 🏗️ Architecture Overview

```
                          ┌───────────────────────────┐
                          │   React 18 + Vite (SPA)   │
                          │  Tailwind CSS + Lucide    │
                          └─────────────┬─────────────┘
                                        │
                         HTTP / REST API │ (Port 3000)
                                        ▼
                          ┌───────────────────────────┐
                          │     Express.js Server     │
                          │  (server.ts / security.ts) │
                          └──────┬─────────────┬──────┘
                                 │             │
                 ┌───────────────┴──┐       ┌──┴───────────────┐
                 │  ADK Multi-Stage │       │   RAG Engine     │
                 │   Barista Agent  │       │ Knowledge Chunks │
                 └──────┬───────────┘       └──────────────────┘
                        │
                        ▼
                 ┌──────────────────────────┐
                 │  @google/genai SDK       │
                 │  (Gemini Models + TTS)   │
                 └──────────────────────────┘
```

---

## 🧪 Comprehensive Automated Test Suite

The application includes an automated test runner (`server/testSuite.ts`) executing 14 tests spanning Unit, Integration, and Security Penetration domains:

```bash
npm test
```

### Test Coverage Highlights:
1. **Unit Tests**:
   - Menu catalog integrity and pricing constant verification.
   - Customer profile dietary, allergen, and caffeine tolerance validation.
   - RAG vector semantic keyword retrieval and cosine ranking.
   - Allergen exclusion safety guardrails (gluten-free, dairy-free).
   - Decaf caffeine threshold enforcement (<= 25mg).
2. **Security & Penetration Tests**:
   - PromptGuard adversarial pattern detection (DAN mode, system override, jailbreaks).
   - Safe conversational query pass-through.
   - Output credential redaction and XML tag boundary isolation.
   - Server-side price recalculation defeating client price tampering exploits.
   - Negative quantity and `NaN` injection rejection.
   - Customization add-on and alternative milk surcharge calculations.
   - Prototype pollution vector elimination (`__proto__`, `constructor`).
3. **Integration Tests**:
   - Full ADK Agent execution loop with multi-stage telemetry trace validation.
   - Customer dietary restriction enforcement in synthesized responses.

---

## 🚀 Running & Developing Locally

### Prerequisites
* Node.js v18+
* `GEMINI_API_KEY` (configured in `.env` or system environment)

### Commands
```bash
# Start the development server (Express + Vite on port 3000)
npm run dev

# Run the comprehensive test suite
npm test

# Type-check and lint codebase
npm run lint

# Build production bundle
npm run build

# Start production server
npm start
```

---

## 🔒 Security Summary

| Defense Layer | Mechanism | Target Threats |
|---|---|---|
| **Boundary Isolation** | `<user_query>` XML wrapping | Prompt Injection & Hijacking |
| **Output Redactor** | Regex credential masking | Secret/API Key Exfiltration |
| **Authoritative Pricing** | Server-side cart recalculation | Price Tampering, Negative Quantities |
| **Input Sanitizer** | Deep recursive key filtering | Prototype Pollution, Object Tampering |
| **Rate Limiter** | In-memory sliding window | DDoS, Brute Force, Token Abuse |
| **Security Headers** | CSP, HSTS, X-Content-Type-Options | Clickjacking, MIME Sniffing, XSS |

---

*Engineered with precision for the ultimate specialty coffee experience.*
