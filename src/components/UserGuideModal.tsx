import React, { useState } from 'react';
import {
  Coffee,
  Sparkles,
  BookOpen,
  Sliders,
  Volume2,
  ShieldCheck,
  Activity,
  Award,
  ShoppingBag,
  Layers,
  Search,
  CheckCircle2,
  HelpCircle,
  X,
  ChevronRight,
  Info,
  Clock,
  Flame,
  Zap,
  Users,
  Terminal,
  Compass,
  ArrowRight
} from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTrace?: () => void;
  onOpenKnowledge?: () => void;
  onOpenLoyalty?: () => void;
}

type GuideSectionId =
  | 'overview'
  | 'adk_agent'
  | 'personas'
  | 'rag_knowledge'
  | 'customizer'
  | 'ambient_audio'
  | 'loyalty_analytics'
  | 'order_tracking'
  | 'security_defense';

interface GuideSection {
  id: GuideSectionId;
  title: string;
  badge: string;
  icon: React.ElementType;
  description: string;
  color: string;
  steps: {
    step: string;
    action: string;
    tip?: string;
  }[];
  keyCapabilities: string[];
  samplePrompts?: string[];
}

const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'overview',
    title: 'Welcome & Quick Start',
    badge: 'Getting Started',
    icon: Compass,
    color: 'from-amber-500 to-orange-500',
    description:
      'Roast & Reason is an intelligent specialty coffee sommelier powered by Google Agent Development Kit (ADK) multi-stage reasoning, Retrieval-Augmented Generation (RAG), and real-time procedural ambient soundscapes.',
    steps: [
      {
        step: '1. Select Your Customer Persona',
        action: 'Choose an existing persona (e.g. Alex Morgan, Dr. Maya Chen) from the top bar to automatically load dietary preferences and allergies.'
      },
      {
        step: '2. Chat with the ADK Barista Agent',
        action: 'Ask for recommendations in natural language, request specific flavor profiles, or ask questions about bean origins and extraction.'
      },
      {
        step: '3. Customize Your Handcrafted Drink',
        action: 'Click "Customize" on any drink card or recommendation to adjust milk options, sweetness levels, brew temperatures, and superfood add-ons.'
      },
      {
        step: '4. Enjoy Café Ambience & Place Your Order',
        action: 'Toggle the procedural Web Audio ambient soundscape (Café Murmur, Rain on Glass, Lofi Beats) and place your order with real-time status tracking.'
      }
    ],
    keyCapabilities: [
      'Multi-Stage ADK Reasoning (Planner ➔ RAG ➔ Tool ➔ Synthesis)',
      'Allergen & Dietary Guardrails (Strict Decaf, Keto, Dairy-Free)',
      '100% Client-Side Procedural Ambient Soundscapes (Zero 404 MP3s)',
      'Authoritative Server-Side Price Recalculation & Tamper Defense'
    ]
  },
  {
    id: 'adk_agent',
    title: 'Multi-Stage ADK Barista Agent',
    badge: 'AI Sommelier',
    icon: Sparkles,
    color: 'from-amber-500 to-yellow-500',
    description:
      'The AI Barista uses multi-stage agentic reasoning to understand your lifestyle, dietary requirements, current weather, and time of day before crafting personalized coffee pairings.',
    steps: [
      {
        step: '1. Type or Click Suggested Prompts',
        action: 'Type any natural query (e.g. "I want a creamy iced afternoon drink that is dairy-free") or click quick-prompt chips.',
        tip: 'The agent automatically incorporates your active profile dietary constraints.'
      },
      {
        step: '2. Review Multi-Stage Telemetry',
        action: 'Click the "ADK Trace" button in the navigation bar or expand the reasoning accordion under agent replies to inspect each reasoning step.'
      },
      {
        step: '3. One-Click Add to Order',
        action: 'Click "Add to Order" directly from the AI recommendation card to send the customized beverage into your order tray.'
      }
    ],
    keyCapabilities: [
      'Context Binding: Merges persona bio, allergies, caffeine limits, and weather',
      'Dynamic Guardrails: Blocks unsafe allergen combinations automatically',
      'Voice Synthesis: Web Speech API & Gemini Flash TTS voice narration',
      'XML Tag Boundary Isolation: Strict prompt injection and jailbreak protection'
    ],
    samplePrompts: [
      'Recommend an afternoon pick-me-up that won’t upset lactose intolerance',
      'I am on strict keto and want a floral pour-over with zero sugar',
      'What drink pairs best with a rainy chilly afternoon?',
      'Tell me about the extraction science of Ethiopian Yirgacheffe V60'
    ]
  },
  {
    id: 'personas',
    title: 'Customer Personas & Dietary Profiles',
    badge: 'Personalization',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    description:
      'Dynamically switch between pre-configured customer personas or test custom dietary constraints. The Barista Agent adapts its recommendations, milk suggestions, and allergen warnings in real-time.',
    steps: [
      {
        step: '1. Click Any Avatar in Persona Bar',
        action: 'Select Alex Morgan (UX Designer, Dairy-Free Oat Milk lover), Dr. Maya Chen (Keto Researcher, Pour-Over Connoisseur), or Sam Rivera (Decaf Sweet Tooth).'
      },
      {
        step: '2. Observe Dynamic Context Shift',
        action: 'The loyalty tier, available reward points, favorite flavor notes, and past order history instantly update across the interface.'
      },
      {
        step: '3. Automatic Allergen & Preference Propagation',
        action: 'Drink customizer defaults (e.g. Oat Milk for Alex, MCT & Black for Maya) automatically pre-populate to save time.'
      }
    ],
    keyCapabilities: [
      'Bi-directional Profile Sync with Agent & Customizer',
      'Allergen Isolation Matrix (Cow milk, soy, nuts, gluten, artificial sweeteners)',
      'Loyalty Tier Mapping (Bronze, Silver, Gold, Coffee Master)',
      'Order History & "Order Again" instant re-ordering'
    ]
  },
  {
    id: 'rag_knowledge',
    title: 'Grounded RAG Knowledge Base',
    badge: 'Domain Science',
    icon: BookOpen,
    color: 'from-emerald-500 to-teal-500',
    description:
      'Retrieval-Augmented Generation (RAG) grounds the Barista Agent with verified coffee chemistry, terroir agronomy, extraction recipes, and dietary health protocols.',
    steps: [
      {
        step: '1. Open Knowledge Base Modal',
        action: 'Click "Knowledge" in the header navigation to browse all grounded chunks.'
      },
      {
        step: '2. Filter by Scientific Category',
        action: 'Filter by Flavor Science, Menu Item Specs, Brewing Guides, Dietary Protocols, or Seasonal Specials.'
      },
      {
        step: '3. Real-Time Semantic Search',
        action: 'Type keywords like "Yirgacheffe", "Microfoam", "MCT", or "L-Theanine" to see matching chunks and similarity rankings.'
      }
    ],
    keyCapabilities: [
      'Semantic TF-IDF & Cosine Similarity Ranking with Tag Boosting',
      'Terroir Agronomy: Elevation, soil profile, wash processing details',
      'Extraction Science: Water temperature, grind size, and TDS extraction yields',
      'Health Chemistry: Chlorogenic acid, antioxidant retention, L-Theanine synergy'
    ]
  },
  {
    id: 'customizer',
    title: 'Interactive Drink Customizer',
    badge: 'Handcrafted',
    icon: Sliders,
    color: 'from-purple-500 to-pink-500',
    description:
      'Fine-tune every dimension of your handcrafted coffee with real-time price, calorie, and caffeine calculation.',
    steps: [
      {
        step: '1. Choose Size & Temperature',
        action: 'Select Standard (12oz), Large (16oz +$0.75), or Venti (20oz +$1.25), and toggle between Hot or Iced.'
      },
      {
        step: '2. Select Milk & Sweetness Level',
        action: 'Choose from Oat, Almond, Soy, Whole, Skim, or Black, and dial sweetness from Unsweetened to Monkfruit or Extra Sweet.'
      },
      {
        step: '3. Add Superfood & Wellness Boosts',
        action: 'Add extra espresso shots, MCT oil, grass-fed ghee, collagen protein, or house vanilla bean syrup.'
      }
    ],
    keyCapabilities: [
      'Real-Time Nutrition Calculation: Dynamic calories and caffeine (mg)',
      'Smart Allergen Badges: Warns if selected milk/add-on contradicts active profile',
      'Authoritative Price Preview: Accurately reflects all size and add-on surcharges'
    ]
  },
  {
    id: 'ambient_audio',
    title: 'Procedural Ambient Soundscapes',
    badge: 'Web Audio API',
    icon: Volume2,
    color: 'from-rose-500 to-amber-500',
    description:
      'Zero-asset, real-time procedural audio synthesis running directly in the browser using the Web Audio API. Eliminates network audio lag and 404 MP3 errors.',
    steps: [
      {
        step: '1. Click Soundwave Icon in Header',
        action: 'Click the ambient player widget in the top right of the navigation bar.'
      },
      {
        step: '2. Select Acoustic Soundscape',
        action: 'Choose between "Coffee Shop Ambience" (warm murmur, portafilter clinks), "Rain on Glass" (gentle drops), or "Lofi Café Beats" (Rhodes chords & vinyl crackle).'
      },
      {
        step: '3. Adjust Volume & Master Mute',
        action: 'Slide the volume bar or click the master speaker icon for instant mute.'
      }
    ],
    keyCapabilities: [
      '100% Procedural Web Audio Synthesis (No external MP3 files needed)',
      'Subtle Pink/Brown Noise Filtering with Randomized Spatial Resonances',
      'Independent Gain Nodes for background music, rain, and barista clinks'
    ]
  },
  {
    id: 'loyalty_analytics',
    title: 'Loyalty Tracker & Analytics',
    badge: 'Rewards',
    icon: Award,
    color: 'from-amber-400 to-yellow-600',
    description:
      'Track your tier advancement (Bronze, Silver, Gold, Coffee Master), redeem points for instant checkout discounts, and view your weekly coffee investments.',
    steps: [
      {
        step: '1. View Loyalty Tier Badge',
        action: 'Click the loyalty pill in the persona bar or open the Loyalty Tracker drawer.'
      },
      {
        step: '2. Redeem Rewards for Order Discounts',
        action: 'Check the "Apply 100 pts for $2.00 off" toggle during checkout in the Order Tray.'
      },
      {
        step: '3. Inspect Spending Analytics',
        action: 'View your 7-day spending frequency sparkline chart rendered with interactive tooltips.'
      }
    ],
    keyCapabilities: [
      'Tier Progress Bar with points-to-next-tier calculation',
      'Interactive Recharts Visual Analytics for daily coffee habits',
      'One-Click "Order Again" past order replication'
    ]
  },
  {
    id: 'order_tracking',
    title: 'Order Tray & Live Status Tracker',
    badge: 'Order Lifecycle',
    icon: ShoppingBag,
    color: 'from-emerald-500 to-green-600',
    description:
      'Submit orders with server-side price validation and follow the live five-stage visual preparation progress bar with celebratory confetti.',
    steps: [
      {
        step: '1. Review Order Tray',
        action: 'Click the "Tray" button in the header to review selected items, customizations, subtotal, and tax.'
      },
      {
        step: '2. Confirm Order',
        action: 'Click "Place Handcrafted Order" to generate an authoritative verified order ticket.'
      },
      {
        step: '3. Watch Live Preparation Stages',
        action: 'Track progression through Grinding Beans ➔ Extraction ➔ Steaming Milk ➔ Quality Inspection ➔ Ready for Pickup!'
      }
    ],
    keyCapabilities: [
      'Interactive Step-by-Step Visual Progress Bar',
      'Canvas Confetti celebration on order completion',
      'Estimated pickup countdown timer'
    ]
  },
  {
    id: 'security_defense',
    title: 'Enterprise Security & Hack Defense',
    badge: 'Defense-in-Depth',
    icon: ShieldCheck,
    color: 'from-red-500 to-rose-600',
    description:
      'Military-grade defense-in-depth protection securing the AI sommelier, customer carts, and backend APIs from modern exploits.',
    steps: [
      {
        step: '1. PromptGuard Injection Testing',
        action: 'The agent actively scans for adversarial prompts ("Ignore previous instructions", "DAN mode", system extraction) and neutralizes them.'
      },
      {
        step: '2. Server-Side Price Verification',
        action: 'Cart prices, milk fees, and taxes are recalculated server-side. Tampered client payloads are rejected immediately.'
      },
      {
        step: '3. Anti-Prototype Pollution & Rate Limiting',
        action: 'All incoming JSON bodies are stripped of __proto__ keys, and sliding-window rate limiters block brute-force traffic.'
      }
    ],
    keyCapabilities: [
      'PromptGuard: XML Tag Boundary Isolation (`<user_query>`)',
      'CartSecurityValidator: Authoritative server price re-computation',
      'InputSanitizer: Recursive prototype pollution defense',
      '14/14 Passing Unit & Penetration Defense Test Suite'
    ]
  }
];

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenTrace,
  onOpenKnowledge,
  onOpenLoyalty
}) => {
  const [activeSectionId, setActiveSectionId] = useState<GuideSectionId>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const currentSection = GUIDE_SECTIONS.find((s) => s.id === activeSectionId) || GUIDE_SECTIONS[0];

  const filteredSections = GUIDE_SECTIONS.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.keyCapabilities.some((k) => k.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-zinc-900/95 backdrop-blur-2xl border border-white/[0.12] rounded-3xl max-w-5xl w-full text-zinc-100 shadow-2xl my-6 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-center justify-between bg-zinc-950/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <Compass className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                  Roast & Reason — User & Feature Guide
                </h3>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Step-by-Step
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Complete walkthrough of ADK reasoning, RAG knowledge, customizer, soundscapes & security
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 flex items-center justify-center border border-white/[0.08] transition cursor-pointer"
            title="Close User Guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Sub-Navigation */}
        <div className="p-4 sm:px-6 bg-zinc-950/40 border-b border-white/[0.06] flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search features (e.g. ADK, RAG, Decaf)..."
              className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 transition"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
            {filteredSections.map((sec) => {
              const Icon = sec.icon;
              const isActive = sec.id === activeSectionId;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                    isActive
                      ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border-white/[0.06]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{sec.title.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Body: Two Columns on Large Screens */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar Index */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold px-2 mb-1">
              Feature Categories ({filteredSections.length})
            </div>
            <div className="space-y-1.5">
              {filteredSections.map((sec) => {
                const Icon = sec.icon;
                const isActive = sec.id === activeSectionId;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSectionId(sec.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-zinc-950 border-amber-500/50 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/30'
                        : 'bg-zinc-950/40 hover:bg-zinc-950/80 border-white/[0.04] text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                          isActive
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-zinc-900 text-zinc-500 border-white/[0.06]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                          {sec.title}
                        </div>
                        <div className="text-[10px] text-zinc-500 font-medium">
                          {sec.badge}
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 transition ${
                        isActive ? 'text-amber-400 translate-x-0.5' : 'text-zinc-600'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Quick Action Helpers */}
            <div className="mt-4 p-4 rounded-2xl bg-linear-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Interactive Tool Launchers</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {onOpenTrace && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenTrace();
                    }}
                    className="p-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-900 border border-white/[0.08] text-zinc-300 hover:text-amber-300 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Activity className="w-3 h-3 text-amber-400" />
                    <span>ADK Trace</span>
                  </button>
                )}
                {onOpenKnowledge && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenKnowledge();
                    }}
                    className="p-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-900 border border-white/[0.08] text-zinc-300 hover:text-amber-300 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <BookOpen className="w-3 h-3 text-emerald-400" />
                    <span>RAG Base</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Section Banner */}
            <div className="bg-zinc-950 border border-white/[0.08] rounded-3xl p-5 sm:p-6 space-y-3 relative overflow-hidden shadow-xl">
              <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span>{currentSection.badge}</span>
              </div>

              <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                {currentSection.title}
              </h2>

              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                {currentSection.description}
              </p>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>How to Use This Feature (Step-by-Step)</span>
              </div>

              <div className="space-y-2.5">
                {currentSection.steps.map((s, idx) => (
                  <div
                    key={idx}
                    className="bg-zinc-950/80 border border-white/[0.06] hover:border-amber-500/30 rounded-2xl p-4 space-y-1.5 transition"
                  >
                    <div className="text-xs font-bold text-amber-300 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono flex items-center justify-center border border-amber-500/30">
                        {idx + 1}
                      </span>
                      <span>{s.step}</span>
                    </div>
                    <p className="text-xs text-zinc-300 pl-7 leading-relaxed">{s.action}</p>
                    {s.tip && (
                      <div className="ml-7 mt-1 text-[11px] text-amber-200/90 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                        <Info className="w-3 h-3 shrink-0 text-amber-400" />
                        <span>{s.tip}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Key Capabilities */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-400 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Key Technical Capabilities</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentSection.keyCapabilities.map((cap, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-zinc-950/60 border border-white/[0.06] text-xs text-zinc-200 flex items-start gap-2.5"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></div>
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Prompts (if available) */}
            {currentSection.samplePrompts && currentSection.samplePrompts.length > 0 && (
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-400 flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-amber-400" />
                  <span>Try Asking the Barista Agent</span>
                </div>

                <div className="space-y-2">
                  {currentSection.samplePrompts.map((prompt, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-zinc-950 border border-amber-500/20 text-xs text-amber-200/90 font-mono flex items-center justify-between gap-2"
                    >
                      <span>"{prompt}"</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 bg-zinc-950 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-400 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Roast & Reason ADK Architecture • 100% Client & Cloud Resilient</span>
            <span className="sm:hidden">ADK Architecture</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition shadow-md shadow-amber-500/20 cursor-pointer"
          >
            Got It! Start Exploring ☕
          </button>
        </div>
      </div>
    </div>
  );
};
