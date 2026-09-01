import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  Award,
  ArrowRight,
  Coffee,
  X
} from 'lucide-react';
import { CartItem, CustomerProfile, OrderDraft } from '../types';

interface OrderTrayProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  customer: CustomerProfile;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onSubmitOrder: (order: OrderDraft) => void;
}

export const OrderTray: React.FC<OrderTrayProps> = ({
  isOpen,
  onClose,
  items,
  customer,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSubmitOrder
}) => {
  const [applyPointsDiscount, setApplyPointsDiscount] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const pointsDiscountAmount = applyPointsDiscount && customer.loyaltyPoints >= 100 ? 2.00 : 0;
  const discount = Math.min(subtotal, pointsDiscountAmount);
  const tax = Number(((subtotal - discount) * 0.0825).toFixed(2));
  const total = Number((Math.max(0, subtotal - discount + tax)).toFixed(2));
  const pointsEarned = Math.round(total * 10);

  const handleCheckout = async () => {
    if (items.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/order/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customer.id,
          customerName: customer.name,
          items,
          subtotal,
          discount,
          tax,
          total,
          notes: orderNotes
        })
      });

      const data = await response.json();
      if (data.success && data.order) {
        onSubmitOrder(data.order);
        onClearCart();
        onClose();
      }
    } catch (err) {
      console.error('Order checkout failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end">
      <div className="bg-zinc-900/95 backdrop-blur-2xl border-l border-white/[0.12] w-full max-w-md h-full flex flex-col justify-between text-zinc-100 shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-zinc-950/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-md shadow-amber-500/10">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">Live Order Tray</h3>
              <p className="text-[11px] text-zinc-400">
                Ordering for <span className="text-amber-400 font-semibold">{customer.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 flex items-center justify-center border border-white/[0.08] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400">
              <div className="w-16 h-16 rounded-3xl bg-zinc-950 border border-white/[0.08] flex items-center justify-center text-zinc-500 mb-3 shadow-inner">
                <Coffee className="w-8 h-8 text-zinc-600" />
              </div>
              <h4 className="font-display text-base font-semibold text-zinc-200">Your tray is empty</h4>
              <p className="text-xs text-zinc-500 max-w-xs mt-1.5 leading-relaxed">
                Ask Barista Sage for personalized recommendations or pick from our craft menu catalog!
              </p>
            </div>
          ) : (
            items.map((cartItem) => (
              <div
                key={cartItem.cartItemId}
                className="bg-zinc-950/70 border border-white/[0.08] rounded-2xl p-4 space-y-2.5 text-xs shadow-md"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex gap-3">
                    <img
                      src={cartItem.item.image}
                      alt={cartItem.item.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/[0.08]"
                    />
                    <div>
                      <h4 className="font-bold text-zinc-100 text-xs sm:text-sm">{cartItem.item.name}</h4>
                      <p className="text-[11px] font-mono text-amber-400 font-semibold mt-0.5">
                        ${cartItem.unitPrice.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(cartItem.cartItemId)}
                    className="text-zinc-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-zinc-900 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Modifiers Pill list */}
                <div className="bg-zinc-900/90 rounded-xl p-2.5 text-[11px] text-zinc-300 space-y-1 border border-white/[0.04]">
                  <div className="flex justify-between text-zinc-400 font-mono">
                    <span>
                      {cartItem.customization.size} • {cartItem.customization.temperature.toUpperCase()}
                    </span>
                    <span>{cartItem.calculatedCalories} kcal</span>
                  </div>
                  {cartItem.customization.milk && (
                    <div className="text-zinc-300">🥛 Milk: {cartItem.customization.milk}</div>
                  )}
                  {cartItem.customization.sweetness && (
                    <div className="text-zinc-300">🍯 Sweetness: {cartItem.customization.sweetness}</div>
                  )}
                  {cartItem.customization.extraShots > 0 && (
                    <div className="text-amber-300 font-medium font-mono">
                      ⚡ +{cartItem.customization.extraShots} Extra Espresso Shot(s)
                    </div>
                  )}
                  {cartItem.customization.addOns.length > 0 && (
                    <div className="text-zinc-300">
                      ✨ Add-ons: {cartItem.customization.addOns.join(', ')}
                    </div>
                  )}
                  {cartItem.customization.specialInstructions && (
                    <div className="text-zinc-400 italic">
                      Note: "{cartItem.customization.specialInstructions}"
                    </div>
                  )}
                </div>

                {/* Quantity & Item Total */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 bg-zinc-900 border border-white/[0.08] rounded-xl p-1">
                    <button
                      onClick={() =>
                        onUpdateQuantity(cartItem.cartItemId, cartItem.quantity - 1)
                      }
                      className="w-6 h-6 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center hover:bg-zinc-700 transition"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center font-mono font-bold text-xs text-zinc-200">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(cartItem.cartItemId, cartItem.quantity + 1)
                      }
                      className="w-6 h-6 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center hover:bg-zinc-700 transition"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="font-mono font-bold text-sm text-zinc-100">
                    ${cartItem.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pricing Summary & Checkout */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-zinc-950 border-t border-white/[0.08] space-y-3.5 text-xs">
            {/* Loyalty Points Redemption Toggle */}
            {customer.loyaltyPoints >= 100 && (
              <label className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 cursor-pointer transition hover:bg-amber-500/15">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={applyPointsDiscount}
                    onChange={(e) => setApplyPointsDiscount(e.target.checked)}
                    className="rounded border-zinc-700 text-amber-500 focus:ring-amber-500 bg-zinc-900"
                  />
                  <div>
                    <span className="text-amber-200 font-semibold block">Redeem 100 Loyalty Points</span>
                    <span className="text-[10px] font-mono text-zinc-400">Balance: {customer.loyaltyPoints} pts</span>
                  </div>
                </div>
                <span className="text-emerald-400 font-mono font-bold">-$2.00 OFF</span>
              </label>
            )}

            {/* Subtotal, tax, total */}
            <div className="space-y-1.5 text-zinc-300 font-mono">
              <div className="flex justify-between font-sans">
                <span className="text-zinc-400">Subtotal ({items.length} items)</span>
                <span className="font-mono">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold font-sans">
                  <span>Loyalty Discount</span>
                  <span className="font-mono">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-400 font-sans">
                <span>Estimated Tax (8.25%)</span>
                <span className="font-mono">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2.5 border-t border-white/[0.08] font-sans">
                <span>Total Due</span>
                <span className="text-amber-400 font-mono text-lg">${total.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-amber-400/90 pt-1 font-sans">
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Points to earn with this order:
                </span>
                <strong className="font-mono font-bold">+{pointsEarned} pts</strong>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              id="btn-checkout-order"
              className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition"
            >
              {isSubmitting ? (
                <span>Transmitting to Cloud Run Barista...</span>
              ) : (
                <>
                  <span>Send Order to Barista — ${total.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
