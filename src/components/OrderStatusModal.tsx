import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Coffee,
  Flame,
  Sparkles,
  Clock,
  Award,
  TrendingUp,
  X,
  Check
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { OrderDraft } from '../types';

interface OrderStatusModalProps {
  order: OrderDraft | null;
  onClose: () => void;
  onOpenLoyalty?: () => void;
}

const SPARKLINE_DATA = [
  { day: 'Mon', spend: 5.95 },
  { day: 'Tue', spend: 9.20 },
  { day: 'Wed', spend: 5.95 },
  { day: 'Thu', spend: 11.90 },
  { day: 'Fri', spend: 6.50 },
  { day: 'Sat', spend: 14.50 },
  { day: 'Sun', spend: 18.25 }
];

export const OrderStatusModal: React.FC<OrderStatusModalProps> = ({ order, onClose, onOpenLoyalty }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    { title: 'Order Received', desc: 'Sent to Cloud Run ADK Agent Order Pipeline' },
    { title: 'Grinding Single-Origin Beans', desc: 'Precision burr grinding at 92°C brew temp' },
    { title: 'Extraction & Steaming Microfoam', desc: 'Pulling double shot espresso & texturing milk' },
    { title: 'Barista Quality & Flavor Check', desc: 'Crafting latte art & checking dietary adherence' },
    { title: 'Ready at Counter for Pickup!', desc: 'Fresh, handcrafted, and personalized for you' }
  ];

  useEffect(() => {
    if (!order) return;
    setCurrentStepIndex(0);

    const timer1 = setTimeout(() => setCurrentStepIndex(1), 2200);
    const timer2 = setTimeout(() => setCurrentStepIndex(2), 4800);
    const timer3 = setTimeout(() => setCurrentStepIndex(3), 7400);
    const timer4 = setTimeout(() => {
      setCurrentStepIndex(4);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 10000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [order]);

  if (!order) return null;

  const isComplete = currentStepIndex === 4;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900/95 backdrop-blur-2xl border border-white/[0.12] rounded-3xl max-w-lg w-full text-zinc-100 shadow-2xl p-6 sm:p-7 relative my-4 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-200 p-2 rounded-full bg-zinc-950 hover:bg-zinc-800 border border-white/[0.08] transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header */}
        <div className="text-center space-y-1.5 pb-5 border-b border-white/[0.08]">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/10 mb-2">
            <Coffee className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm">
              {isComplete ? 'Ready for Pickup' : 'Brewing Live'}
            </span>
          </div>
          <h3 className="font-display text-2xl font-bold text-white mt-1">Order #{order.id}</h3>
          <p className="text-xs text-zinc-400">
            Handcrafting for <strong className="text-amber-400">{order.customerName}</strong>
          </p>
        </div>

        {/* Timeline Pipeline */}
        <div className="py-5 space-y-3.5">
          {steps.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={idx} className="flex items-start gap-3.5">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 ${
                      isDone
                        ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                        : isCurrent
                        ? 'bg-amber-500 text-zinc-950 ring-4 ring-amber-500/25 animate-pulse font-bold'
                        : 'bg-zinc-950 text-zinc-500 border border-white/[0.08]'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`w-0.5 h-5 my-1 transition-colors duration-300 ${
                        idx < currentStepIndex ? 'bg-emerald-500' : 'bg-zinc-800'
                      }`}
                    />
                  )}
                </div>

                <div className="flex-1 pt-0.5">
                  <h4
                    className={`text-xs font-bold transition-colors ${
                      isCurrent
                        ? 'text-amber-300'
                        : isDone
                        ? 'text-zinc-200'
                        : 'text-zinc-500'
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Items Preview & Loyalty Points */}
        <div className="bg-zinc-950/80 rounded-2xl p-4 border border-white/[0.08] text-xs space-y-2 shadow-sm font-mono">
          <div className="flex justify-between font-semibold text-zinc-300 border-b border-white/[0.06] pb-1.5 font-sans">
            <span>Items in this batch:</span>
            <span className="font-mono">${order.total.toFixed(2)}</span>
          </div>
          {order.items.map((it, i) => (
            <div key={i} className="flex justify-between text-zinc-400 text-[11px]">
              <span>
                {it.quantity}x {it.item.name} ({it.customization.size.split(' ')[0]})
              </span>
              <span>${it.totalPrice.toFixed(2)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between text-[11px] text-amber-400 pt-1.5 font-sans font-semibold border-t border-white/[0.06]">
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              Loyalty Points Earned:
            </span>
            <span className="font-mono font-bold">+{order.pointsEarned} pts</span>
          </div>
        </div>

        {/* Mini Recharts Weekly Spending Sparkline */}
        <div className="mt-4 bg-zinc-950/60 rounded-2xl p-3 border border-white/[0.06] space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Weekly Spending Sparkline
            </span>
            {onOpenLoyalty && (
              <button
                onClick={onOpenLoyalty}
                className="text-amber-400 hover:text-amber-300 font-mono text-[10px] underline"
              >
                View Rewards →
              </button>
            )}
          </div>
          <div className="h-14 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SPARKLINE_DATA} margin={{ top: 2, right: 2, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="orderSparkline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-zinc-900 border border-white/[0.1] rounded px-2 py-1 text-[10px] text-white">
                          ${(payload[0].value as number)?.toFixed(2)}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="spend"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#orderSparkline)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Close / Counter Pickup Button */}
        <button
          onClick={onClose}
          id="btn-close-order-status"
          className="mt-4 w-full py-3 px-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold text-xs transition border border-white/[0.08] active:scale-98"
        >
          {isComplete ? 'Enjoy your Drink!' : 'Keep Browsing Menu'}
        </button>
      </div>
    </div>
  );
};
