import React, { useState } from 'react';
import {
  Activity,
  Layers,
  Database,
  Cpu,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  X,
  Code
} from 'lucide-react';
import { CustomerProfile, EnvironmentContext, RAGChunk } from '../types';

interface AdkTraceInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: CustomerProfile;
  env: EnvironmentContext;
}

export const AdkTraceInspector: React.FC<AdkTraceInspectorProps> = ({
  isOpen,
  onClose,
  activeProfile,
  env
}) => {
  const [testQuery, setTestQuery] = useState('low caffeine iced drink with oat milk');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  if (!isOpen) return null;

  const handleTestSearch = async () => {
    if (!testQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch('/api/rag/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: testQuery,
          customerProfile: activeProfile,
          excludeAllergens: activeProfile.allergies
        })
      });
      const data = await res.json();
      setTestResults(data.results || []);
    } catch (err) {
      console.error('RAG test search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900/95 backdrop-blur-2xl border border-white/[0.12] rounded-3xl max-w-4xl w-full text-zinc-100 shadow-2xl p-6 sm:p-7 my-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-display text-lg font-bold text-white">
                  Google Agent Development Kit (ADK) Inspector
                </h3>
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm">
                  Observability Live
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Agent Orchestration, RAG Similarity Scoring, and Cloud Run Runtime Diagnostics
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

        {/* 4 Core Pillars Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 my-5">
          <div className="bg-zinc-950/80 border border-white/[0.08] rounded-2xl p-3.5 space-y-1.5 shadow-md">
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold font-mono">
              <Cpu className="w-3.5 h-3.5" />
              <span>Model Agent</span>
            </div>
            <p className="text-sm font-bold text-zinc-100">Gemini 3.7 Flash</p>
            <p className="text-[11px] text-zinc-400">Low-latency reasoning on Cloud Run</p>
          </div>

          <div className="bg-zinc-950/80 border border-white/[0.08] rounded-2xl p-3.5 space-y-1.5 shadow-md">
            <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-semibold font-mono">
              <Database className="w-3.5 h-3.5" />
              <span>RAG Knowledge Base</span>
            </div>
            <p className="text-sm font-bold text-zinc-100">11 Grounded Chunks</p>
            <p className="text-[11px] text-zinc-400">Origin notes, extraction, allergy rules</p>
          </div>

          <div className="bg-zinc-950/80 border border-white/[0.08] rounded-2xl p-3.5 space-y-1.5 shadow-md">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Guardrails</span>
            </div>
            <p className="text-sm font-bold text-zinc-100 truncate">Allergen & Caffeine Filter</p>
            <p className="text-[11px] text-zinc-400 truncate">Active: {activeProfile.allergies.join(', ') || 'Zero allergies'}</p>
          </div>

          <div className="bg-zinc-950/80 border border-white/[0.08] rounded-2xl p-3.5 space-y-1.5 shadow-md">
            <div className="flex items-center gap-1.5 text-xs text-purple-400 font-semibold font-mono">
              <Layers className="w-3.5 h-3.5" />
              <span>ADK Tools</span>
            </div>
            <p className="text-sm font-bold text-zinc-100">5 Registered Tools</p>
            <p className="text-[11px] text-zinc-400">RAG Search, Profile, Promos, Draft</p>
          </div>
        </div>

        {/* ADK Lifecycle Pipeline Flowchart */}
        <div className="bg-zinc-950/80 border border-white/[0.08] rounded-3xl p-5 my-5 space-y-3.5 shadow-md">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 font-mono">
            <Code className="w-4 h-4 text-amber-400" />
            ADK End-to-End Execution Pipeline
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-zinc-900/90 border border-white/[0.08] rounded-2xl p-3.5 space-y-1.5">
              <div className="flex items-center gap-1 font-bold text-amber-300 font-mono">
                <span>1. State Binding</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Binds customer '{activeProfile.name}' preferences, time of day ({env.timeOfDay}), and weather into agent context.
              </p>
            </div>

            <div className="bg-zinc-900/90 border border-white/[0.08] rounded-2xl p-3.5 space-y-1.5">
              <div className="flex items-center gap-1 font-bold text-cyan-300 font-mono">
                <span>2. RAG Retrieval</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Executes hybrid cosine similarity search on knowledge chunks with allergen exclusion filters.
              </p>
            </div>

            <div className="bg-zinc-900/90 border border-white/[0.08] rounded-2xl p-3.5 space-y-1.5">
              <div className="flex items-center gap-1 font-bold text-purple-300 font-mono">
                <span>3. Tool Invocation</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Calculates personalized recipe adjustments (milk substitution, sweetness, extra shots, pricing).
              </p>
            </div>

            <div className="bg-zinc-900/90 border border-white/[0.08] rounded-2xl p-3.5 space-y-1.5">
              <div className="flex items-center gap-1 font-bold text-emerald-300 font-mono">
                <span>4. Grounded Synthesis</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Gemini 3.7 generates conversational barista recommendations grounded exclusively in RAG facts.
              </p>
            </div>
          </div>
        </div>

        {/* Live Interactive RAG Query Tester */}
        <div className="bg-zinc-950/80 border border-white/[0.08] rounded-3xl p-5 space-y-3.5 shadow-md">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2 font-mono">
              <Search className="w-4 h-4 text-cyan-400" />
              Live RAG Retrieval Tester
            </h4>
            <span className="text-[11px] text-zinc-400 font-mono">
              Active Allergen Filter: <strong className="text-red-400">{activeProfile.allergies.join(', ') || 'None'}</strong>
            </span>
          </div>

          <div className="flex gap-2.5">
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="Test query (e.g. 'floral pour over', 'keto mct', 'lactose free cold brew')..."
              className="flex-1 bg-zinc-900 border border-white/[0.08] rounded-2xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition font-mono"
            />
            <button
              onClick={handleTestSearch}
              disabled={isSearching}
              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold rounded-2xl transition shadow-lg shadow-cyan-500/20 active:scale-98"
            >
              {isSearching ? 'Retrieving...' : 'Run Vector Search'}
            </button>
          </div>

          {/* Test Search Results */}
          {testResults.length > 0 && (
            <div className="space-y-2.5 pt-3 border-t border-white/[0.06]">
              <div className="text-[11px] font-semibold text-zinc-400 font-mono">
                Top Grounded Chunks Retrieved ({testResults.length}):
              </div>
              <div className="space-y-2.5">
                {testResults.map((res, i) => (
                  <div
                    key={i}
                    className="p-3.5 bg-zinc-900/90 border border-white/[0.08] rounded-2xl text-xs space-y-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-200">{res.chunk.title}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-mono text-[10px] border border-cyan-500/30">
                        Score: {(res.score * 100).toFixed(1)}% match
                      </span>
                    </div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">{res.chunk.content}</p>
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-zinc-500">
                      <span>Matched tokens:</span>
                      {res.matchedKeywords.map((kw: string) => (
                        <span
                          key={kw}
                          className="px-2 py-0.5 rounded-md bg-zinc-950 text-amber-300 font-mono border border-white/[0.06]"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
