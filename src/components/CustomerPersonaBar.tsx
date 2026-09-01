import React, { useState } from 'react';
import { User, Award, ShieldAlert, Heart, History, Check, Edit3, SlidersHorizontal, Sparkles, RotateCcw, TrendingUp } from 'lucide-react';
import { CustomerProfile } from '../types';

interface CustomerPersonaBarProps {
  profiles: CustomerProfile[];
  activeProfile: CustomerProfile;
  onSelectProfile: (profile: CustomerProfile) => void;
  onUpdateProfile: (updated: CustomerProfile) => void;
  onOpenLoyalty?: () => void;
  onOrderAgain?: (drinkName: string, customizations: string) => void;
}

export const CustomerPersonaBar: React.FC<CustomerPersonaBarProps> = ({
  profiles,
  activeProfile,
  onSelectProfile,
  onUpdateProfile,
  onOpenLoyalty,
  onOrderAgain
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<CustomerProfile>(activeProfile);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(editForm);
    setIsEditing(false);
  };

  return (
    <section className="bg-zinc-900/60 border-b border-white/[0.06] text-zinc-200 py-2.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Persona Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5 shrink-0 mr-1">
            <User className="w-3.5 h-3.5 text-amber-400" />
            Persona:
          </span>
          {profiles.map((p) => {
            const isSelected = p.id === activeProfile.id;
            return (
              <button
                key={p.id}
                id={`btn-select-persona-${p.id}`}
                onClick={() => {
                  onSelectProfile(p);
                  setEditForm(p);
                }}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 shadow-sm shadow-amber-500/10'
                    : 'bg-zinc-900/90 hover:bg-zinc-800 border-white/[0.08] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <img
                  src={p.avatar}
                  alt={p.name}
                  className={`w-5 h-5 rounded-full object-cover border transition ${
                    isSelected ? 'border-amber-400' : 'border-zinc-700'
                  }`}
                />
                <span className="font-semibold">{p.name.split(' ')[0]}</span>
                {isSelected ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
                ) : null}
              </button>
            );
          })}
          <button
            onClick={() => {
              setEditForm(activeProfile);
              setIsEditing(true);
            }}
            id="btn-edit-persona"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 border border-white/[0.08] text-xs font-medium shrink-0 transition"
            title="Edit active customer preferences"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Preferences</span>
          </button>
        </div>

        {/* Right: Active Profile Badges & Interactive Loyalty Widget Trigger */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Interactive Loyalty Points Tracker Button */}
          <button
            onClick={onOpenLoyalty}
            id="btn-persona-loyalty-tracker"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/10 hover:from-amber-500/30 hover:to-amber-600/20 text-amber-300 border border-amber-500/30 font-medium transition active:scale-95 shadow-sm"
            title="View Loyalty Points, Rewards Catalog, and Weekly Spending Sparkline"
          >
            <Award className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="font-semibold">{activeProfile.loyaltyTier}</span>
            <span className="text-amber-200 font-mono font-bold text-[11px] bg-amber-500/20 px-1.5 py-0.2 rounded-full">
              {activeProfile.loyaltyPoints} pts
            </span>
            <TrendingUp className="w-3 h-3 text-emerald-400 ml-0.5" />
          </button>

          {/* Milk & Flavor */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-zinc-300 text-[11px]">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>{activeProfile.milkPreference.split(' ')[0]}</span>
            <span className="text-zinc-600">•</span>
            <span>{activeProfile.sweetnessPreference.split(' ')[0]}</span>
          </div>

          {/* Allergens / Guardrails */}
          {activeProfile.allergies.length > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/40 text-rose-300 border border-rose-800/50 text-[11px]">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Guardrail: {activeProfile.allergies.join(', ')}</span>
            </div>
          )}

          {/* Past favorite drink + Fast Order Again button */}
          {activeProfile.pastOrders.length > 0 && (
            <div className="flex items-center gap-1.5 pl-2 pr-1 py-0.5 rounded-full bg-zinc-900 border border-white/[0.08] text-zinc-300 text-[11px]">
              <History className="w-3 h-3 text-zinc-400 shrink-0" />
              <span className="truncate max-w-[130px] hidden sm:inline" title={activeProfile.pastOrders[0].drinkName}>
                {activeProfile.pastOrders[0].drinkName}
              </span>
              {onOrderAgain && (
                <button
                  onClick={() =>
                    onOrderAgain(
                      activeProfile.pastOrders[0].drinkName,
                      activeProfile.pastOrders[0].customizations
                    )
                  }
                  id="btn-order-again-persona-bar"
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-[10px] transition shadow-sm active:scale-95"
                  title="Re-order this customer's favorite beverage"
                >
                  <RotateCcw className="w-2.5 h-2.5 stroke-[2.5]" />
                  <span>Order Again</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Customer Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-white/[0.1] rounded-3xl max-w-lg w-full p-6 text-zinc-100 shadow-2xl animate-in fade-in zoom-in duration-150 my-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-zinc-100">Customer Profile & Taste Matrix</h3>
                  <p className="text-xs text-zinc-400">Grounds the ADK Agent & RAG vector filter</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 flex items-center justify-center text-sm transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1.5">Customer Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500 transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1.5">Milk Preference</label>
                  <select
                    value={editForm.milkPreference}
                    onChange={(e) => setEditForm({ ...editForm, milkPreference: e.target.value })}
                    className="w-full bg-zinc-950 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500 transition"
                  >
                    <option value="Oat Milk (Default)">Oat Milk</option>
                    <option value="Almond Milk">Almond Milk</option>
                    <option value="Whole Milk">Whole Milk</option>
                    <option value="Soy Milk">Soy Milk</option>
                    <option value="None / Black (Recommended)">None / Black</option>
                    <option value="Grass-fed Ghee & MCT (Default)">Grass-fed Ghee (Keto)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1.5">Caffeine Tolerance</label>
                  <select
                    value={editForm.caffeineTolerance}
                    onChange={(e) => setEditForm({ ...editForm, caffeineTolerance: e.target.value as any })}
                    className="w-full bg-zinc-950 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500 transition"
                  >
                    <option value="high">High (Nitro & Multi-shots)</option>
                    <option value="medium">Medium (Standard Espresso)</option>
                    <option value="low">Low (Matcha / Green Tea)</option>
                    <option value="decaf">Decaf Only (Swiss Water)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1.5">Sweetness Level</label>
                <select
                  value={editForm.sweetnessPreference}
                  onChange={(e) => setEditForm({ ...editForm, sweetnessPreference: e.target.value })}
                  className="w-full bg-zinc-950 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500 transition"
                >
                  <option value="100% Standard">100% Standard</option>
                  <option value="50% Half Sweet">50% Half Sweet</option>
                  <option value="25% Light Sweet">25% Light Sweet</option>
                  <option value="Unsweetened (Keto Standard)">Unsweetened / Keto</option>
                  <option value="Sugar-Free Monkfruit">Sugar-Free Monkfruit</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1.5">Dietary Restrictions & Allergens (comma-separated)</label>
                <input
                  type="text"
                  value={editForm.allergies.join(', ')}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      allergies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    })
                  }
                  placeholder="e.g. dairy, peanuts, gluten"
                  className="w-full bg-zinc-950 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              {/* Past Orders Section inside Profile with Order Again */}
              {editForm.pastOrders && editForm.pastOrders.length > 0 && (
                <div className="pt-2 border-t border-white/[0.08] space-y-2">
                  <div className="flex justify-between items-center text-zinc-400 text-[11px] font-semibold">
                    <span className="flex items-center gap-1">
                      <History className="w-3.5 h-3.5 text-amber-400" />
                      Saved Past Orders
                    </span>
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {editForm.pastOrders.map((p, idx) => (
                      <div
                        key={idx}
                        className="bg-zinc-950 p-2.5 rounded-xl border border-white/[0.06] flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-zinc-200 truncate">{p.drinkName}</p>
                          <p className="text-[10px] text-zinc-400 truncate">{p.customizations}</p>
                        </div>
                        {onOrderAgain && (
                          <button
                            type="button"
                            onClick={() => {
                              onOrderAgain(p.drinkName, p.customizations);
                              setIsEditing(false);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-[10px] flex items-center gap-1 transition shrink-0"
                          >
                            <RotateCcw className="w-2.5 h-2.5" />
                            <span>Re-order</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold transition shadow-lg shadow-amber-500/20"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};


