import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  TrendingUp,
  Gift,
  Coffee,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  Star,
  Zap,
  ArrowUpRight,
  Clock,
  History,
  ShieldCheck,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { CustomerProfile, MenuItem } from '../types';

interface LoyaltyTrackerWidgetProps {
  customer: CustomerProfile;
  isOpen: boolean;
  onClose: () => void;
  onOrderAgain: (drinkName: string, customizations: string) => void;
  onRedeemReward?: (rewardName: string, pointsCost: number) => void;
}

// Weekly Spending & Order Frequency Mock datasets customized per customer persona
const WEEKLY_SPENDING_DATA: Record<
  string,
  { day: string; spend: number; cups: number; favorite: string }[]
> = {
  'alex-morgan': [
    { day: 'Mon', spend: 5.95, cups: 1, favorite: 'Honey Cinnamon Latte' },
    { day: 'Tue', spend: 9.20, cups: 2, favorite: 'Iced Oat Latte + Banana Loaf' },
    { day: 'Wed', spend: 5.95, cups: 1, favorite: 'Ceremonial Matcha Latte' },
    { day: 'Thu', spend: 11.90, cups: 2, favorite: 'Double Oat Latte' },
    { day: 'Fri', spend: 6.50, cups: 1, favorite: 'Specialty Seasonal Pour-Over' },
    { day: 'Sat', spend: 14.50, cups: 3, favorite: 'Brunch Batch with Friends' },
    { day: 'Sun', spend: 5.95, cups: 1, favorite: 'Iced Honey Cinnamon Latte' }
  ],
  'maya-chen': [
    { day: 'Mon', spend: 6.50, cups: 1, favorite: 'Yirgacheffe V60' },
    { day: 'Tue', spend: 13.00, cups: 2, favorite: 'Keto Brain-Fuel MCT Americano' },
    { day: 'Wed', spend: 6.50, cups: 1, favorite: 'Ethiopian Single-Origin' },
    { day: 'Thu', spend: 15.50, cups: 2, favorite: 'Reserve Geisha Flight' },
    { day: 'Fri', spend: 6.50, cups: 1, favorite: 'Cold Drip Nitrogen' },
    { day: 'Sat', spend: 8.00, cups: 1, favorite: 'Aeropress Reserve' },
    { day: 'Sun', spend: 12.00, cups: 2, favorite: 'Yirgacheffe Double' }
  ],
  'liam-rodriguez': [
    { day: 'Mon', spend: 5.45, cups: 1, favorite: 'Swiss Water Decaf Flat White' },
    { day: 'Tue', spend: 8.70, cups: 2, favorite: 'Decaf Latte + Vegan Scone' },
    { day: 'Wed', spend: 4.50, cups: 1, favorite: 'Sparkling Hibiscus Yuzu' },
    { day: 'Thu', spend: 5.45, cups: 1, favorite: 'Decaf Velvet Flat White' },
    { day: 'Fri', spend: 9.95, cups: 2, favorite: 'Decaf Mocha' },
    { day: 'Sat', spend: 4.50, cups: 1, favorite: 'Botanical Tea' },
    { day: 'Sun', spend: 8.90, cups: 2, favorite: 'Weekend Decaf Blend' }
  ],
  'sam-patel': [
    { day: 'Mon', spend: 6.25, cups: 1, favorite: 'Nitro Cold Brew with Foam' },
    { day: 'Tue', spend: 6.25, cups: 1, favorite: 'Nitro Cold Brew' },
    { day: 'Wed', spend: 12.50, cups: 2, favorite: 'Double Cold Brew Study Fuel' },
    { day: 'Thu', spend: 6.25, cups: 1, favorite: 'Nitro Salted Foam' },
    { day: 'Fri', spend: 10.50, cups: 2, favorite: 'Nitro + Double Shot' },
    { day: 'Sat', spend: 6.25, cups: 1, favorite: 'Weekend Nitro' },
    { day: 'Sun', spend: 12.50, cups: 2, favorite: 'Exam Prep Nitro Flight' }
  ]
};

interface RewardItem {
  id: string;
  title: string;
  pointsCost: number;
  description: string;
  category: 'discount' | 'drink' | 'upgrade' | 'vip';
  icon: string;
}

const REWARDS_CATALOG: RewardItem[] = [
  {
    id: 'rew-oat-upgrade',
    title: 'Free Oat Milk & Double Shot Upgrade',
    pointsCost: 50,
    description: 'Upgrade any beverage to barista oat milk and add an extra espresso shot on the house.',
    category: 'upgrade',
    icon: '⚡'
  },
  {
    id: 'rew-cold-foam',
    title: 'Free Artisanal Salted Cold Foam',
    pointsCost: 75,
    description: 'Add our velvety vanilla sea-salted cold foam or oat foam to any iced brew.',
    category: 'upgrade',
    icon: '✨'
  },
  {
    id: 'rew-2-off',
    title: '$2.00 Off Any Order',
    pointsCost: 100,
    description: 'Instantly deduct $2.00 from your live order total at checkout.',
    category: 'discount',
    icon: '💵'
  },
  {
    id: 'rew-free-pastry',
    title: 'Free Handcrafted Organic Pastry',
    pointsCost: 200,
    description: 'Complimentary vegan banana walnut loaf, croissant, or lemon blueberry scone.',
    category: 'drink',
    icon: '🥐'
  },
  {
    id: 'rew-reserve-flight',
    title: 'Free Specialty Pour-Over or Nitro Drink',
    pointsCost: 400,
    description: 'Any signature handcrafted beverage or single-origin Ethiopian V60 on the house.',
    category: 'vip',
    icon: '☕'
  }
];

export const LoyaltyTrackerWidget: React.FC<LoyaltyTrackerWidgetProps> = ({
  customer,
  isOpen,
  onClose,
  onOrderAgain,
  onRedeemReward
}) => {
  const [chartMetric, setChartMetric] = useState<'spend' | 'cups'>('spend');
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'rewards'>('overview');

  if (!isOpen) return null;

  const weeklyData = WEEKLY_SPENDING_DATA[customer.id] || WEEKLY_SPENDING_DATA['alex-morgan'];
  const totalWeeklySpend = weeklyData.reduce((acc, curr) => acc + curr.spend, 0);
  const totalWeeklyCups = weeklyData.reduce((acc, curr) => acc + curr.cups, 0);

  // Next milestone calculation
  let nextMilestone = 100;
  if (customer.loyaltyPoints >= 100 && customer.loyaltyPoints < 200) nextMilestone = 200;
  else if (customer.loyaltyPoints >= 200 && customer.loyaltyPoints < 400) nextMilestone = 400;
  else if (customer.loyaltyPoints >= 400) nextMilestone = 800;

  const progressPercentage = Math.min(100, Math.round((customer.loyaltyPoints / nextMilestone) * 100));
  const pointsRemaining = Math.max(0, nextMilestone - customer.loyaltyPoints);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900/95 backdrop-blur-2xl border border-white/[0.12] rounded-3xl max-w-2xl w-full text-zinc-100 shadow-2xl p-6 sm:p-7 my-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/30 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <Award className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-display text-xl font-bold text-white">
                  Loyalty Points & Spending
                </h3>
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {customer.loyaltyTier} Tier
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Member: <span className="text-zinc-200 font-semibold">{customer.name}</span> • Earn 10 pts per $1.00 spent
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

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 mt-5 mb-5 p-1 bg-zinc-950/80 rounded-2xl border border-white/[0.08]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Points & Trends</span>
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'rewards'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Rewards Catalog</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'history'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Order History & Re-order</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & SPARKLINE CHART */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* Points Balance Banner */}
            <div className="bg-gradient-to-r from-amber-950/40 via-zinc-900/90 to-zinc-900/90 border border-amber-500/30 rounded-3xl p-5 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Available Balance
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display font-bold text-4xl sm:text-5xl text-white">
                      {customer.loyaltyPoints}
                    </span>
                    <span className="text-sm font-bold text-amber-400 font-mono">POINTS</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    {pointsRemaining === 0
                      ? '🎉 You have unlocked the top tier rewards!'
                      : `${pointsRemaining} pts needed for the next milestone reward (${nextMilestone} pts)`}
                  </p>
                </div>

                {/* Progress Ring / Bar */}
                <div className="w-full sm:w-48 bg-zinc-950/80 rounded-2xl p-3 border border-white/[0.08]">
                  <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-1.5">
                    <span>Progress to {nextMilestone} pts</span>
                    <span className="text-amber-300 font-bold">{progressPercentage}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-zinc-500 mt-1.5">
                    <span>0 pts</span>
                    <span className="text-amber-400 font-semibold">{nextMilestone} pts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recharts Weekly Spending / Frequency Sparkline Section */}
            <div className="bg-zinc-950/80 border border-white/[0.08] rounded-3xl p-5 space-y-4 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-display text-sm font-bold text-white">
                      Weekly Coffee Analytics & Frequency
                    </h4>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Past 7-day handcrafted order velocity and spend trajectory
                  </p>
                </div>

                {/* Metric toggle */}
                <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-white/[0.06] text-xs self-start sm:self-auto">
                  <button
                    onClick={() => setChartMetric('spend')}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      chartMetric === 'spend'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Spend ($)
                  </button>
                  <button
                    onClick={() => setChartMetric('cups')}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      chartMetric === 'cups'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Cups Ordered
                  </button>
                </div>
              </div>

              {/* Weekly Highlights Mini Bento */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="bg-zinc-900/90 rounded-2xl p-3 border border-white/[0.06]">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">Weekly Total</span>
                  <p className="font-mono text-base font-bold text-amber-300 mt-0.5">
                    ${totalWeeklySpend.toFixed(2)}
                  </p>
                </div>
                <div className="bg-zinc-900/90 rounded-2xl p-3 border border-white/[0.06]">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">Cups Brewed</span>
                  <p className="font-mono text-base font-bold text-emerald-300 mt-0.5">
                    {totalWeeklyCups} drinks
                  </p>
                </div>
                <div className="bg-zinc-900/90 rounded-2xl p-3 border border-white/[0.06]">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">Points Gained</span>
                  <p className="font-mono text-base font-bold text-purple-300 mt-0.5">
                    +{Math.round(totalWeeklySpend * 10)} pts
                  </p>
                </div>
                <div className="bg-zinc-900/90 rounded-2xl p-3 border border-white/[0.06]">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">Avg / Drink</span>
                  <p className="font-mono text-base font-bold text-cyan-300 mt-0.5">
                    ${(totalWeeklySpend / totalWeeklyCups).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Recharts Area / Bar Sparkline Chart */}
              <div className="h-48 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  {chartMetric === 'spend' ? (
                    <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="day"
                        stroke="#71717a"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#71717a"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `$${v}`}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-zinc-900 border border-white/[0.12] rounded-xl p-2.5 shadow-2xl text-xs space-y-1">
                                <p className="font-bold text-white">{data.day} Spending</p>
                                <p className="text-amber-400 font-mono font-bold">${data.spend.toFixed(2)}</p>
                                <p className="text-[10px] text-zinc-400">Fav: {data.favorite}</p>
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
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#spendGradient)"
                      />
                    </AreaChart>
                  ) : (
                    <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis
                        dataKey="day"
                        stroke="#71717a"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#71717a"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-zinc-900 border border-white/[0.12] rounded-xl p-2.5 shadow-2xl text-xs space-y-1">
                                <p className="font-bold text-white">{data.day} Orders</p>
                                <p className="text-emerald-400 font-mono font-bold">{data.cups} artisan drink(s)</p>
                                <p className="text-[10px] text-zinc-400">Fav: {data.favorite}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="cups" fill="#10b981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REWARDS CATALOG */}
        {activeTab === 'rewards' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400 font-semibold">
                Available Rewards for {customer.name} ({customer.loyaltyPoints} pts)
              </span>
            </div>

            <div className="space-y-2.5">
              {REWARDS_CATALOG.map((rew) => {
                const canRedeem = customer.loyaltyPoints >= rew.pointsCost;
                return (
                  <div
                    key={rew.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      canRedeem
                        ? 'bg-zinc-950/80 border-amber-500/30 hover:border-amber-400/50 shadow-sm'
                        : 'bg-zinc-950/40 border-white/[0.04] opacity-70'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-0.5">{rew.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-zinc-100 text-xs sm:text-sm">{rew.title}</h4>
                          <span className="font-mono font-bold text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            {rew.pointsCost} pts
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                          {rew.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (onRedeemReward && canRedeem) {
                          onRedeemReward(rew.title, rew.pointsCost);
                        }
                      }}
                      disabled={!canRedeem}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center justify-center gap-1.5 ${
                        canRedeem
                          ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md shadow-amber-500/20 cursor-pointer active:scale-95'
                          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/[0.04]'
                      }`}
                    >
                      {canRedeem ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Redeem Voucher</span>
                        </>
                      ) : (
                        <span>Need {rew.pointsCost - customer.loyaltyPoints} more pts</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: PAST ORDERS & INSTANT ORDER AGAIN */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400 font-semibold">
                Recent Handcrafted Orders for {customer.name}
              </span>
            </div>

            <div className="space-y-3">
              {customer.pastOrders.map((past, i) => (
                <div
                  key={i}
                  className="bg-zinc-950/80 border border-white/[0.08] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:border-amber-500/30 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                      <Coffee className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-zinc-100 text-xs sm:text-sm">{past.drinkName}</h4>
                        <div className="flex items-center text-amber-400 text-[10px]">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="ml-1 font-mono font-semibold">{past.rating}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        <span className="text-zinc-500 font-mono">Custom:</span> {past.customizations}
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-0.5 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {past.date}
                      </p>
                    </div>
                  </div>

                  {/* Order Again Button */}
                  <button
                    onClick={() => onOrderAgain(past.drinkName, past.customizations)}
                    id={`btn-order-again-${i}`}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 shrink-0"
                    title="Instantly add this exact personalized drink to your current live order tray"
                  >
                    <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Order Again</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
