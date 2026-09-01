import React from 'react';
import {
  ShieldCheck,
  Server,
  Cpu,
  Layers,
  Database,
  Terminal,
  CheckCircle2,
  X,
  ExternalLink,
  Code2
} from 'lucide-react';

interface ArchitectureInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureInfoModal: React.FC<ArchitectureInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900/95 backdrop-blur-2xl border border-white/[0.12] rounded-3xl max-w-4xl w-full text-zinc-100 shadow-2xl p-6 sm:p-7 my-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-display text-lg font-bold text-white">
                  Track 1 Lab 1: Cloud Run + ADK + RAG Architecture
                </h3>
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm">
                  Production Blueprint
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Customer-Facing AI Agent with Google Agent Development Kit and RAG on Google Cloud
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 flex items-center justify-center border border-white/[0.08] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Architecture Components */}
        <div className="space-y-4 my-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
            {/* 1. ADK Agent */}
            <div className="bg-zinc-950/80 border border-white/[0.08] rounded-2xl p-4 sm:p-5 space-y-2.5 shadow-md">
              <div className="flex items-center gap-2 text-amber-400 font-bold font-mono">
                <Layers className="w-4 h-4" />
                <span>1. Google ADK Agent</span>
              </div>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Implements the ADK lifecycle: Goal decomposition, State & Customer Profile binding, Tool dispatching, and Grounded reasoning synthesis.
              </p>
              <div className="text-[10px] text-zinc-400 font-mono bg-zinc-900/90 p-3 rounded-xl border border-white/[0.06] space-y-1">
                <div>• Intent Planner</div>
                <div>• Tool Registry</div>
                <div>• Guardrail Filter</div>
                <div>• Observability Trace</div>
              </div>
            </div>

            {/* 2. RAG Retrieval */}
            <div className="bg-zinc-950/80 border border-white/[0.08] rounded-2xl p-4 sm:p-5 space-y-2.5 shadow-md">
              <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono">
                <Database className="w-4 h-4" />
                <span>2. Hybrid RAG Engine</span>
              </div>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Grounds all agent recommendations in real coffee agronomy, extraction chemistry, nutritional facts, and allergy protocols with similarity scores.
              </p>
              <div className="text-[10px] text-zinc-400 font-mono bg-zinc-900/90 p-3 rounded-xl border border-white/[0.06] space-y-1">
                <div>• Vector Cosine Search</div>
                <div>• Allergen Exclusion</div>
                <div>• Caffeine Limits</div>
                <div>• Pairing Matrix</div>
              </div>
            </div>

            {/* 3. Cloud Run Runtime */}
            <div className="bg-zinc-950/80 border border-white/[0.08] rounded-2xl p-4 sm:p-5 space-y-2.5 shadow-md">
              <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono">
                <Cpu className="w-4 h-4" />
                <span>3. Cloud Run & Gemini API</span>
              </div>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Runs server-side on Google Cloud Run with low cold-start latency, integrating `@google/genai` (Gemini 3.7 Flash) and zero client API key exposure.
              </p>
              <div className="text-[10px] text-zinc-400 font-mono bg-zinc-900/90 p-3 rounded-xl border border-white/[0.06] space-y-1">
                <div>• Node.js + Express</div>
                <div>• Gemini 3.7 Flash</div>
                <div>• Gemini TTS Audio</div>
                <div>• Vite SPA Ingress</div>
              </div>
            </div>
          </div>

          {/* Key Lab Highlights */}
          <div className="bg-zinc-950/80 border border-white/[0.08] rounded-3xl p-5 space-y-3.5 shadow-md">
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Customer-Facing Agent Capabilities Demonstrated
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-zinc-300">
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">
                  <strong className="text-white">Personalized Flavor Matching:</strong> Adapts drink suggestions based on customer milk preference, keto/vegan diet, and caffeine sensitivity.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">
                  <strong className="text-white">Time & Weather Awareness:</strong> Recommends refreshing iced nitro brews on hot afternoons and warm comforting decafs for evening relaxation.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">
                  <strong className="text-white">Dietary & Allergen Guardrails:</strong> Automatically prevents recommending cross-reactive allergens (e.g. dairy, nuts) based on user profile.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">
                  <strong className="text-white">Full Observability & Diagnostics:</strong> Real-time trace inspector exposing agent reasoning, tool payloads, and vector similarity metrics.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
