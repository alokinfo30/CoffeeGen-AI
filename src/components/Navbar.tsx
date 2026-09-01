import React from 'react';
import { Coffee, Activity, Sparkles, ShoppingBag, Sun, Moon, CloudSun, ShieldCheck, Terminal, Award, BookOpen } from 'lucide-react';
import { EnvironmentContext, CustomerProfile } from '../types';
import { AmbientSoundPlayer } from './AmbientSoundPlayer';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenTrace: () => void;
  onOpenKnowledge: () => void;
  onOpenArch: () => void;
  onOpenLoyalty?: () => void;
  onOpenGuide?: () => void;
  activeProfile?: CustomerProfile | null;
  env: EnvironmentContext;
  onUpdateEnv: (newEnv: EnvironmentContext) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenTrace,
  onOpenKnowledge,
  onOpenArch,
  onOpenLoyalty,
  onOpenGuide,
  activeProfile,
  env,
  onUpdateEnv
}) => {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/[0.08] text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3.5 shrink-0">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-zinc-950 shadow-lg shadow-amber-500/20 ring-1 ring-white/20">
              <Coffee className="w-5 h-5 text-zinc-950 stroke-[2.2]" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-zinc-950"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg tracking-tight text-white">
                Roast & Reason
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                ADK • RAG
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 tracking-normal hidden md:block">
              AI Coffee Sommelier on Google Cloud Run
            </p>
          </div>
        </div>

        {/* Center: Live Environment Context Controller */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-white/[0.08] shadow-inner text-xs">
          <span className="text-zinc-400 font-medium flex items-center gap-1.5 pl-1">
            {env.timeOfDay === 'morning' && <Sun className="w-3.5 h-3.5 text-amber-400" />}
            {env.timeOfDay === 'afternoon' && <CloudSun className="w-3.5 h-3.5 text-amber-400" />}
            {env.timeOfDay === 'evening' && <Moon className="w-3.5 h-3.5 text-indigo-400" />}
            <span className="text-[11px] text-zinc-500 font-mono">CONTEXT:</span>
          </span>
          <select
            value={env.timeOfDay}
            onChange={(e) => {
              const val = e.target.value as 'morning' | 'afternoon' | 'evening';
              onUpdateEnv({
                ...env,
                timeOfDay: val,
                temperature: val === 'morning' ? '58°F' : val === 'afternoon' ? '74°F' : '62°F'
              });
            }}
            className="bg-transparent text-zinc-200 text-xs font-medium focus:outline-none cursor-pointer hover:text-amber-300 transition"
            id="env-time-select"
          >
            <option value="morning" className="bg-zinc-900">Morning (7:00 AM)</option>
            <option value="afternoon" className="bg-zinc-900">Afternoon (2:30 PM)</option>
            <option value="evening" className="bg-zinc-900">Evening (6:00 PM)</option>
          </select>
          <span className="text-zinc-700">/</span>
          <select
            value={env.weather}
            onChange={(e) => {
              const val = e.target.value as 'crisp_sunny' | 'rainy_chilly' | 'hot_summer';
              onUpdateEnv({ ...env, weather: val });
            }}
            className="bg-transparent text-zinc-200 text-xs font-medium focus:outline-none cursor-pointer hover:text-amber-300 transition"
            id="env-weather-select"
          >
            <option value="crisp_sunny" className="bg-zinc-900">☀️ 74°F Crisp & Sunny</option>
            <option value="rainy_chilly" className="bg-zinc-900">🌧️ 56°F Rainy & Chilly</option>
            <option value="hot_summer" className="bg-zinc-900">🔥 88°F Summer Heat</option>
          </select>
        </div>

        {/* Right Tools, Ambient Audio Player & Cart */}
        <div className="flex items-center gap-2">
          {/* Ambient Sound Player Toggle Widget */}
          <AmbientSoundPlayer />

          {/* ADK Observability */}
          <button
            onClick={onOpenTrace}
            id="btn-open-trace"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-amber-500/30 text-xs font-medium transition hover:border-amber-400/50 shadow-sm"
            title="Inspect Google ADK execution trace and tool calls"
          >
            <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="font-mono text-[11px]">ADK Trace</span>
          </button>

          {/* User & Feature Guide */}
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              id="btn-open-guide"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-linear-to-r from-amber-500/15 to-orange-500/15 hover:from-amber-500/25 hover:to-orange-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold transition hover:border-amber-400/50 shadow-sm cursor-pointer"
              title="Open Complete User & Feature Guide"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px]">Guide</span>
            </button>
          )}

          {/* RAG Knowledge base */}
          <button
            onClick={onOpenKnowledge}
            id="btn-open-knowledge"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/[0.08] text-xs font-medium transition hover:text-white cursor-pointer"
            title="View grounded coffee knowledge chunks and agronomy notes"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px]">Knowledge</span>
          </button>

          {/* Architecture info */}
          <button
            onClick={onOpenArch}
            id="btn-open-arch"
            className="hidden 2xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/[0.08] text-xs font-medium transition hover:text-white"
            title="Cloud Run & Agent Development Kit Architecture"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px]">Cloud Run</span>
          </button>

          {/* Order Tray / Cart */}
          <button
            onClick={onOpenCart}
            id="btn-open-cart"
            className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
            <span>Tray</span>
            {cartCount > 0 && (
              <span className="bg-zinc-950 text-amber-400 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full border border-amber-400/40">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

