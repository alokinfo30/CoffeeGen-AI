import React, { useState } from 'react';
import { Sparkles, Flame, Zap, Plus, Minus, ShoppingBag, ShieldCheck, X } from 'lucide-react';
import { MenuItem, CustomizationState, CartItem } from '../types';

interface DrinkCustomizerModalProps {
  item: MenuItem;
  initialCustomization?: Partial<CustomizationState>;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export const DrinkCustomizerModal: React.FC<DrinkCustomizerModalProps> = ({
  item,
  initialCustomization,
  onClose,
  onAddToCart
}) => {
  const [size, setSize] = useState<'Regular (12oz)' | 'Large (16oz)' | 'Extra Large (20oz)'>(
    initialCustomization?.size || 'Regular (12oz)'
  );
  const [temperature, setTemperature] = useState<'hot' | 'iced'>(
    initialCustomization?.temperature || (item.temperatureOptions.includes('iced') && !item.temperatureOptions.includes('hot') ? 'iced' : 'hot')
  );
  const [milk, setMilk] = useState<string>(
    initialCustomization?.milk || item.milkOptions[0] || 'Standard'
  );
  const [sweetness, setSweetness] = useState<string>(
    initialCustomization?.sweetness || item.sweetnessLevels[0] || 'Standard'
  );
  const [extraShots, setExtraShots] = useState<number>(initialCustomization?.extraShots || 0);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(initialCustomization?.addOns || []);
  const [specialInstructions, setSpecialInstructions] = useState<string>(
    initialCustomization?.specialInstructions || ''
  );
  const [quantity, setQuantity] = useState<number>(1);

  // Price calculations
  const sizePriceDelta = size === 'Large (16oz)' ? 0.75 : size === 'Extra Large (20oz)' ? 1.25 : 0;
  const shotsPrice = extraShots * 1.00;
  const addOnsPrice = selectedAddOns.reduce((sum, addOnName) => {
    const addOn = item.availableAddOns.find(a => a.name === addOnName);
    return sum + (addOn?.price || 0);
  }, 0);

  const unitPrice = Number((item.price + sizePriceDelta + shotsPrice + addOnsPrice).toFixed(2));
  const totalPrice = Number((unitPrice * quantity).toFixed(2));

  // Nutritional calculations
  const sizeCalorieMultiplier = size === 'Large (16oz)' ? 1.3 : size === 'Extra Large (20oz)' ? 1.6 : 1.0;
  const calculatedCalories = Math.round(item.calories * sizeCalorieMultiplier + extraShots * 5 + selectedAddOns.length * 30);
  const calculatedCaffeine = Math.round(item.caffeineMg + extraShots * 75);

  const toggleAddOn = (name: string) => {
    if (selectedAddOns.includes(name)) {
      setSelectedAddOns(selectedAddOns.filter(a => a !== name));
    } else {
      setSelectedAddOns([...selectedAddOns, name]);
    }
  };

  const handleAdd = () => {
    const customization: CustomizationState = {
      size,
      temperature,
      milk,
      sweetness,
      syrups: [],
      extraShots,
      addOns: selectedAddOns,
      specialInstructions
    };

    const cartItem: CartItem = {
      cartItemId: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      item,
      customization,
      unitPrice,
      quantity,
      totalPrice,
      calculatedCalories,
      calculatedCaffeine
    };

    onAddToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900/95 backdrop-blur-2xl border border-white/[0.12] rounded-3xl max-w-xl w-full text-zinc-100 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Header with Image banner */}
        <div className="relative h-48 bg-zinc-950">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 flex items-center justify-center border border-white/[0.1] transition"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-4 left-5 right-5">
            <span className="text-[10px] font-mono font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {item.category.toUpperCase()}
            </span>
            <h3 className="font-display text-2xl font-bold text-white mt-1.5">{item.name}</h3>
            <p className="text-xs text-zinc-300 line-clamp-1">{item.description}</p>
          </div>
        </div>

        {/* Customization Controls */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Temperature Choice if available */}
          {item.temperatureOptions.length > 1 && (
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2 font-mono">
                Temperature
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setTemperature('hot')}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
                    temperature === 'hot'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-md shadow-amber-500/10'
                      : 'bg-zinc-950/60 border-white/[0.08] text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>Freshly Steamed / Hot</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTemperature('iced')}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
                    temperature === 'iced'
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200 shadow-md shadow-cyan-500/10'
                      : 'bg-zinc-950/60 border-white/[0.08] text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Chilled over Crystal Ice</span>
                </button>
              </div>
            </div>
          )}

          {/* Size Choice */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2 font-mono">
              Size Selection
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['Regular (12oz)', 'Large (16oz)', 'Extra Large (20oz)'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`py-2.5 px-2 rounded-2xl text-xs font-semibold border text-center transition-all ${
                    size === s
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-md shadow-amber-500/10'
                      : 'bg-zinc-950/60 border-white/[0.08] text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="font-semibold">{s.split(' ')[0]}</div>
                  <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                    {s.includes('Large') ? (s.includes('Extra') ? '+$1.25' : '+$0.75') : 'Standard'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Milk Options */}
          {item.milkOptions.length > 0 && (
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2 font-mono">
                Milk & Dairy Alternatives
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {item.milkOptions.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMilk(m)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-left truncate transition ${
                      milk === m
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-sm'
                        : 'bg-zinc-950/60 border-white/[0.08] text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sweetness */}
          {item.sweetnessLevels.length > 0 && (
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2 font-mono">
                Sweetness Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {item.sweetnessLevels.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSweetness(lvl)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-left truncate transition ${
                      sweetness === lvl
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-sm'
                        : 'bg-zinc-950/60 border-white/[0.08] text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Extra Espresso Shots */}
          {item.category === 'espresso' || item.category === 'cold-brew' ? (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950/60 border border-white/[0.08]">
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">Extra Espresso Shots (+ $1.00/shot)</span>
                <span className="text-[11px] font-mono text-zinc-400">+75mg caffeine per shot</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-900 border border-white/[0.08] rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setExtraShots(Math.max(0, extraShots - 1))}
                  className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono font-bold text-sm w-5 text-center text-amber-400">{extraShots}</span>
                <button
                  type="button"
                  onClick={() => setExtraShots(Math.min(4, extraShots + 1))}
                  className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : null}

          {/* Add-ons */}
          {item.availableAddOns.length > 0 && (
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2 font-mono">
                Artisanal Boosts & Syrups
              </label>
              <div className="space-y-2">
                {item.availableAddOns.map((addOn) => {
                  const isChecked = selectedAddOns.includes(addOn.name);
                  return (
                    <label
                      key={addOn.name}
                      onClick={() => toggleAddOn(addOn.name)}
                      className={`flex items-center justify-between p-3 rounded-2xl border text-xs cursor-pointer transition ${
                        isChecked
                          ? 'bg-amber-500/10 border-amber-500/60 text-amber-200 shadow-sm'
                          : 'bg-zinc-950/60 border-white/[0.08] text-zinc-300 hover:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded border-zinc-700 text-amber-500 focus:ring-amber-500 bg-zinc-900"
                        />
                        <span className="font-medium">{addOn.name}</span>
                      </div>
                      <span className="font-mono font-semibold text-zinc-400">+${addOn.price.toFixed(2)}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Barista Instructions */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5 font-mono">
              Barista Special Instructions
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Extra hot, light ice, double cup"
              className="w-full bg-zinc-950 border border-white/[0.08] rounded-2xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 transition"
            />
          </div>
        </div>

        {/* Nutritional & Caffeine Live Summary Bar */}
        <div className="bg-zinc-950 px-6 py-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <strong className="text-zinc-100">{calculatedCalories}</strong> kcal
            </span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <strong className="text-zinc-100">{calculatedCaffeine}</strong> mg
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-sans font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Grounded Recipe</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-zinc-900/90 border-t border-white/[0.08] flex items-center justify-between gap-3">
          {/* Quantity stepper */}
          <div className="flex items-center gap-2 bg-zinc-950 border border-white/[0.08] rounded-2xl p-1">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-200 flex items-center justify-center text-sm font-bold hover:bg-zinc-700 transition"
            >
              -
            </button>
            <span className="font-mono font-bold text-xs text-zinc-200 w-5 text-center">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-200 flex items-center justify-center text-sm font-bold hover:bg-zinc-700 transition"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            id="btn-confirm-add-to-cart"
            className="flex-1 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            <span>Add to Order — ${totalPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
