# 📖 Roast & Reason Coffee Lab — Complete User & Feature Guide

Welcome to the **Roast & Reason Coffee Lab** user guide! This comprehensive guide walks you through every feature of the intelligent barista platform, including multi-stage AI reasoning, domain RAG retrieval, real-time procedural acoustics, drink customization, loyalty analytics, and defense-in-depth security.

---

## 📑 Table of Contents
1. [Quick Start & Overview](#1-quick-start--overview)
2. [Multi-Stage ADK Barista Agent & Chat](#2-multi-stage-adk-barista-agent--chat)
3. [Customer Personas & Dietary Protocols](#3-customer-personas--dietary-protocols)
4. [Grounded RAG Knowledge Base](#4-grounded-rag-knowledge-base)
5. [Interactive Handcrafted Drink Customizer](#5-interactive-handcrafted-drink-customizer)
6. [Procedural Web Audio Ambient Soundscapes](#6-procedural-web-audio-ambient-soundscapes)
7. [Customer Loyalty Rewards & Visual Spending Analytics](#7-customer-loyalty-rewards--visual-spending-analytics)
8. [Order Tray & Real-Time Order Lifecycle Tracker](#8-order-tray--real-time-order-lifecycle-tracker)
9. [Enterprise Security & Hack Defense](#9-enterprise-security--hack-defense)
10. [REST API Reference & Endpoints](#10-rest-api-reference--endpoints)

---

## 1. Quick Start & Overview

Roast & Reason is an enterprise-grade specialty coffee sommelier powered by:
- **Google Agent Development Kit (ADK)** multi-stage reasoning (`planner` ➔ `rag_retrieval` ➔ `tool_execution` ➔ `synthesis`).
- **Retrieval-Augmented Generation (RAG)** across coffee terroir agronomy, extraction science, and dietary safety.
- **Web Audio API Ambient Synthesizer** (100% client-side zero-asset soundscapes).
- **Defense-in-Depth Security** (`PromptGuard`, `CartSecurityValidator`, `InputSanitizer`).

### 3-Step Walkthrough:
1. **Choose a Persona**: Pick a customer persona (e.g. *Alex Morgan* for dairy-free oat milk, or *Dr. Maya Chen* for keto single-origin pour-overs) from the persona bar at the top.
2. **Consult the AI Barista**: Ask questions in natural language, request pairings, or explore bean tasting notes.
3. **Customize & Order**: Tweak your beverage (milks, sweetness levels, superfood add-ons), place your order, and watch the live preparation tracker with celebratory confetti!

---

## 2. Multi-Stage ADK Barista Agent & Chat

The AI Barista goes beyond basic chatbots by executing an autonomous four-stage decision pipeline before producing any recommendation:

```
[User Query + Profile Bio] 
       │
       ▼
 1. 🧠 PLANNER STAGE
    Extracts dietary restrictions, allergens, time of day, and weather context.
       │
       ▼
 2. 🔍 RAG RETRIEVAL STAGE
    Runs semantic cosine similarity matching across domain flavor chemistry chunks.
       │
       ▼
 3. 🛡️ TOOL EXECUTION & GUARDRAILS
    Verifies allergen safety isolation and inventory availability.
       │
       ▼
 4. ☕ GROUNDED SYNTHESIS
    Formulates a warm, personalized barista pairing with accurate milk & sweetness defaults.
```

### How to Use:
1. **Interactive Prompt Chips**: Click quick chips like *"Afternoon Pick-Me-Up"* or *"Floral Single-Origin Pour-Over"* to start immediately.
2. **Free-Form Chat**: Ask complex queries:
   - *"I'm lactose intolerant and love sweet cinnamon notes. What should I order?"*
   - *"What's the difference between Ethiopian Yirgacheffe and Nitro Cold Brew?"*
3. **Inspect ADK Telemetry**: Click the **ADK Trace** accordion under each agent response or the **ADK Trace** button in the top navigation to view execution durations and tool parameters.
4. **Voice Narration**: Click the audio speaker icon to hear the response spoken in a warm barista voice using the browser's Web Speech API or Gemini Flash TTS.

---

## 3. Customer Personas & Dietary Protocols

Personalization is central to Roast & Reason. Switching personas dynamically reconfigures the AI Sommelier and the entire catalog:

| Persona | Role | Key Dietary Protocol | Allergens | Favorite Flavor Notes | Loyalty Tier |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Alex Morgan** | UX Designer | Dairy-Free (Oat Milk) | Cow's Milk, Dairy | Wild Honey, Cinnamon, Toasted Oats | Gold (340 pts) |
| **Dr. Maya Chen** | Bio-Tech Researcher | Strict Keto & Low-Sugar | Artificial Sweeteners | Jasmine, Bergamot, White Peach | Coffee Master (890 pts) |
| **Sam Rivera** | Creative Director | Low-Caffeine / Decaf | Tree Nuts | Vanilla, Caramel, Hazelnut | Silver (180 pts) |

### How to Use:
- Click any avatar on the **Customer Persona Bar**.
- The loyalty points, favorite flavor notes, order history, and customizer defaults will instantly update across the app.

---

## 4. Grounded RAG Knowledge Base

The grounded knowledge base contains curated scientific documents spanning:
- **Flavor Science & Chemistry**: Terroir notes, organic acids (chlorogenic, citric, malic), and sensory wheels.
- **Agronomy & Origins**: Elevation, wash processing, shade-grown micro-lots (Ethiopia Gedeo, Colombia Huila, Guatemala Antigua).
- **Brewing Chemistry**: Water temperature curves, grind distribution, TDS extraction yields (V60, Aeropress, Nitro).
- **Dietary & Health Guides**: Beta-glucans in oat milk, MCT thermogenesis in keto coffee, and L-Theanine calm focus synergies in Uji ceremonial matcha.

### How to Use:
1. Click **"Knowledge"** in the top navigation bar.
2. Filter by category: `All`, `Flavor Science`, `Menu Item`, `Brewing Guide`, `Dietary Guide`, or `Seasonal Special`.
3. Search for terms like `"Yirgacheffe"`, `"MCT"`, `"L-Theanine"`, or `"Microfoam"` to inspect grounded snippets and similarity scores.

---

## 5. Interactive Handcrafted Drink Customizer

Every drink card features an interactive customizer that computes nutrition, caffeine, and pricing in real time:

- **Sizes**:
  - Standard 12oz (Base Price)
  - Large 16oz (+$0.75, +25% Caffeine)
  - Venti 20oz (+$1.25, +50% Caffeine)
- **Milk Options**:
  - Oat Milk Microfoam (+$0.75)
  - Almond Milk (+$0.75)
  - Organic Soy Milk (+$0.50)
  - Whole Milk / Skim Milk (+$0.00)
  - None / Black
- **Sweetness Levels**:
  - 100% Standard Sweet
  - 50% Half Sweet
  - 25% Light Sweet
  - Sugar-Free Monkfruit
  - Unsweetened
- **Superfood & Functional Add-Ons**:
  - Extra Espresso Shot (+$1.00)
  - MCT Brain-Fuel Oil (+$1.25)
  - Grass-Fed Ghee (+$1.00)
  - Collagen Protein Boost (+$1.50)
  - House Vanilla Bean Syrup (+$0.75)

---

## 6. Procedural Web Audio Ambient Soundscapes

Experience the relaxing acoustics of a high-end specialty café with zero external MP3 network dependencies:

1. Click the **Soundwave / Ambient Player** icon in the header.
2. Select your preferred soundscape:
   - ☕ **Coffee Shop Ambience**: Warm filtered pink noise with espresso portafilter clinks, steam wands, and background café murmur.
   - 🌧️ **Rain on Glass**: Gentle brown-noise rainfall with randomized spatial droplet impacts.
   - 🎵 **Lofi Café Beats**: Relaxing Rhodes synth chords, analog vinyl crackle, and soft hip-hop percussion.
3. Use the slider to dial in the perfect volume or toggle mute with a single click.

---

## 7. Customer Loyalty Rewards & Visual Spending Analytics

- **Tier Progression**: Earn 10 points for every $1 spent. Unlock Bronze (0-99), Silver (100-299), Gold (300-499), and Coffee Master (500+).
- **Instant Redemption**: Check the **"Apply 100 pts for $2.00 off"** box in the Order Tray during checkout.
- **Visual Spending Analytics**: Interactive 7-day spending sparklines rendered with Recharts showcasing recent daily coffee investments.
- **One-Click "Order Again"**: Instantly re-order past favorite beverages from your profile history.

---

## 8. Order Tray & Real-Time Order Lifecycle Tracker

1. **Order Tray Drawer**: Click **"Tray"** to review your items, size modifications, milk selections, tax, discounts, and custom barista notes.
2. **Submit Order**: Click **"Place Handcrafted Order"** to generate a cryptographically validated order ticket.
3. **Interactive 5-Stage Order Progress Tracker**:
   - 🫘 **Stage 1**: *Grinding Single-Origin Beans*
   - ⏱️ **Stage 2**: *Calibrating 9-Bar Extraction*
   - 🥛 **Stage 3**: *Steaming Microfoam & Flavor Layering*
   - ✨ **Stage 4**: *Quality & Temperature Inspection*
   - 🎉 **Stage 5**: *Ready for Pickup!* (Celebratory Confetti Animation)

---

## 9. Enterprise Security & Hack Defense

Roast & Reason implements an unbreakable **Defense-in-Depth** security perimeter:

1. **`PromptGuard` (AI Injection & Jailbreak Defense)**:
   - Scans for adversarial prompts (`"Ignore previous instructions"`, `DAN mode`, system prompt extraction).
   - Enforces XML boundary isolation (`<user_query>`).
   - Redacts model outputs to prevent credential or environment leakage.
2. **`CartSecurityValidator` (Authoritative Server-Side Pricing)**:
   - Recalculates every base price, milk surcharge, extra shot, tax, and discount on the server.
   - Rejects negative quantities, client price tampering, and `NaN` injection.
3. **`InputSanitizer` (Anti-Prototype Pollution)**:
   - Recursively strips `__proto__`, `constructor`, and `prototype` from all incoming JSON bodies.
4. **Sliding-Window Rate Limiting**:
   - Per-IP sliding-window limits protect endpoints from brute-force and DDoS attacks.
5. **14/14 Passing Test Suites**:
   - Automated unit, security, and agent integration test runner via `npm run test`.

---

## 10. REST API Reference & Endpoints

| Method | Endpoint | Description | Security / Rate Limit |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Health check & security diagnostics | Global Rate Limit |
| `GET` | `/api/menu` | Complete handcrafted drink catalog | Global Rate Limit |
| `GET` | `/api/profiles` | Customer dietary profiles and past orders | Global Rate Limit |
| `POST` | `/api/agent/chat` | Multi-stage ADK Barista reasoning loop | `PromptGuard` + Chat Rate Limit |
| `POST` | `/api/rag/search` | Direct semantic RAG vector query | Query Sanitizer + Global Limit |
| `GET` | `/api/rag/knowledge`| Full grounded knowledge base chunks | Global Rate Limit |
| `POST` | `/api/order/submit` | Order placement with price verification | `CartSecurityValidator` Anti-Tamper |
| `POST` | `/api/tts` | Gemini Flash TTS / Web Speech narration | Chat Rate Limit |

---

*Enjoy your handcrafted coffee experience at Roast & Reason Coffee Lab! ☕✨*
