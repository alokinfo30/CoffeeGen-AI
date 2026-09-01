import React, { useState, useEffect } from 'react';
import {
  Coffee,
  Sparkles,
  Layers,
  ShoppingBag,
  Sliders,
  Activity,
  Award,
  Flame,
  Zap,
  BookOpen,
  Info
} from 'lucide-react';
import {
  MenuItem,
  CustomerProfile,
  EnvironmentContext,
  CartItem,
  CustomizationState,
  OrderDraft
} from './types';
import { Navbar } from './components/Navbar';
import { CustomerPersonaBar } from './components/CustomerPersonaBar';
import { ChatInterface } from './components/ChatInterface';
import { MenuCatalog } from './components/MenuCatalog';
import { DrinkCustomizerModal } from './components/DrinkCustomizerModal';
import { OrderTray } from './components/OrderTray';
import { OrderStatusModal } from './components/OrderStatusModal';
import { AdkTraceInspector } from './components/AdkTraceInspector';
import { RagKnowledgeViewer } from './components/RagKnowledgeViewer';
import { ArchitectureInfoModal } from './components/ArchitectureInfoModal';
import { LoyaltyTrackerWidget } from './components/LoyaltyTrackerWidget';

export default function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [profiles, setProfiles] = useState<CustomerProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<CustomerProfile | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<'assistant' | 'menu'>('assistant');

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTraceOpen, setIsTraceOpen] = useState(false);
  const [isKnowledgeOpen, setIsKnowledgeOpen] = useState(false);
  const [isArchOpen, setIsArchOpen] = useState(false);
  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<{
    item: MenuItem;
    initialCustomization?: Partial<CustomizationState>;
  } | null>(null);
  const [activeOrder, setActiveOrder] = useState<OrderDraft | null>(null);

  // Environment context
  const [env, setEnv] = useState<EnvironmentContext>({
    timeOfDay: 'afternoon',
    weather: 'crisp_sunny',
    temperature: '74°F',
    storeStatus: 'open',
    baristaDailySpecial: 'Iced Honey Cinnamon Oat Latte + Vegan Banana Loaf Pairing'
  });

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch initial data
  useEffect(() => {
    // 1. Fetch menu
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => {
        if (data.items) setMenuItems(data.items);
      })
      .catch((err) => console.error('Failed to load menu:', err));

    // 2. Fetch profiles
    fetch('/api/profiles')
      .then((res) => res.json())
      .then((data) => {
        if (data.profiles && data.profiles.length > 0) {
          setProfiles(data.profiles);
          setActiveProfile(data.profiles[0]);
        }
      })
      .catch((err) => console.error('Failed to load profiles:', err));
  }, []);

  // Cart operations
  const handleAddToCart = (cartItem: CartItem) => {
    setCart((prev) => {
      // Check if exact same item with same customizations exists
      const existingIdx = prev.findIndex(
        (p) =>
          p.item.id === cartItem.item.id &&
          p.customization.size === cartItem.customization.size &&
          p.customization.milk === cartItem.customization.milk &&
          p.customization.temperature === cartItem.customization.temperature &&
          p.customization.sweetness === cartItem.customization.sweetness
      );

      if (existingIdx >= 0) {
        const updated = [...prev];
        const existing = updated[existingIdx];
        const newQty = existing.quantity + cartItem.quantity;
        updated[existingIdx] = {
          ...existing,
          quantity: newQty,
          totalPrice: Number((existing.unitPrice * newQty).toFixed(2))
        };
        return updated;
      }
      return [...prev, cartItem];
    });

    showToast(`Added ${cartItem.quantity}x ${cartItem.item.name} to order tray!`);
  };

  const handleAddToCartDirect = (item: MenuItem, custom?: Partial<CustomizationState>) => {
    if (!activeProfile) return;

    const customization: CustomizationState = {
      size: custom?.size || 'Regular (12oz)',
      temperature:
        custom?.temperature ||
        (env.timeOfDay === 'afternoon' && item.temperatureOptions.includes('iced')
          ? 'iced'
          : item.temperatureOptions[0] || 'hot'),
      milk:
        custom?.milk ||
        (activeProfile.milkPreference.includes('Oat')
          ? 'Oat Milk (Default)'
          : activeProfile.milkPreference.includes('Almond')
          ? 'Almond Milk'
          : item.milkOptions[0] || 'Standard'),
      sweetness: custom?.sweetness || activeProfile.sweetnessPreference || 'Standard',
      syrups: custom?.syrups || [],
      extraShots: custom?.extraShots || 0,
      addOns: custom?.addOns || [],
      specialInstructions: custom?.specialInstructions || ''
    };

    const cartItem: CartItem = {
      cartItemId: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      item,
      customization,
      unitPrice: item.price,
      quantity: 1,
      totalPrice: item.price,
      calculatedCalories: item.calories,
      calculatedCaffeine: item.caffeineMg
    };

    handleAddToCart(cartItem);
  };

  // Instant "Order Again" for past orders or customer favorites
  const handleOrderAgain = (drinkName: string, customizationsStr?: string) => {
    if (!menuItems || menuItems.length === 0) return;

    // Match menu item by normalized name substring
    const normSearch = drinkName.toLowerCase();
    const matchedItem =
      menuItems.find(
        (m) =>
          m.name.toLowerCase() === normSearch ||
          m.name.toLowerCase().includes(normSearch) ||
          normSearch.includes(m.name.toLowerCase())
      ) || menuItems[0];

    const custom: Partial<CustomizationState> = {};
    if (customizationsStr) {
      const lower = customizationsStr.toLowerCase();
      if (lower.includes('iced')) custom.temperature = 'iced';
      else if (lower.includes('hot')) custom.temperature = 'hot';

      if (lower.includes('oat')) custom.milk = 'Oat Milk (Default)';
      else if (lower.includes('almond')) custom.milk = 'Almond Milk';
      else if (lower.includes('whole')) custom.milk = 'Whole Milk';
      else if (lower.includes('ghee') || lower.includes('mct')) custom.milk = 'Grass-fed Ghee & MCT (Default)';

      if (lower.includes('extra large') || lower.includes('20oz')) custom.size = 'Extra Large (20oz)';
      else if (lower.includes('large') || lower.includes('16oz')) custom.size = 'Large (16oz)';
      else if (lower.includes('regular') || lower.includes('12oz') || lower.includes('small') || lower.includes('8oz')) custom.size = 'Regular (12oz)';

      if (lower.includes('extra shot') || lower.includes('double shot')) custom.extraShots = 1;
    }

    handleAddToCartDirect(matchedItem, custom);
    setIsCartOpen(true);
    showToast(`Added past favorite "${matchedItem.name}" to tray!`);
  };

  const handleRedeemReward = (rewardId: string, pointCost: number) => {
    if (!activeProfile) return;
    if (activeProfile.loyaltyPoints < pointCost) {
      showToast(`Not enough points to redeem this reward.`);
      return;
    }

    const updated: CustomerProfile = {
      ...activeProfile,
      loyaltyPoints: activeProfile.loyaltyPoints - pointCost
    };

    setActiveProfile(updated);
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Redeemed Reward! -${pointCost} points applied.`);
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((c) =>
        c.cartItemId === cartItemId
          ? {
              ...c,
              quantity: newQty,
              totalPrice: Number((c.unitPrice * newQty).toFixed(2))
            }
          : c
      )
    );
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((c) => c.cartItemId !== cartItemId));
  };

  if (!activeProfile) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-amber-400">
          <Coffee className="w-6 h-6 animate-spin" />
          <span className="font-medium text-sm font-display">Bootstrapping Coffee Shop ADK Agent...</span>
        </div>
      </div>
    );
  }

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. Global Navigation Bar with Ambient Audio & Context */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTrace={() => setIsTraceOpen(true)}
        onOpenKnowledge={() => setIsKnowledgeOpen(true)}
        onOpenArch={() => setIsArchOpen(true)}
        onOpenLoyalty={() => setIsLoyaltyOpen(true)}
        activeProfile={activeProfile}
        env={env}
        onUpdateEnv={setEnv}
      />

      {/* 2. Customer Persona Bar with Fast Order Again & Loyalty Tracker Trigger */}
      <CustomerPersonaBar
        profiles={profiles}
        activeProfile={activeProfile}
        onSelectProfile={(p) => {
          setActiveProfile(p);
          showToast(`Switched customer context to ${p.name}`);
        }}
        onUpdateProfile={(updated) => {
          setActiveProfile(updated);
          setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          showToast(`Updated preferences for ${updated.name}`);
        }}
        onOpenLoyalty={() => setIsLoyaltyOpen(true)}
        onOrderAgain={handleOrderAgain}
      />

      {/* 3. Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Mobile / Tablet Tab Switcher */}
        <div className="flex lg:hidden items-center justify-center p-1 bg-zinc-900/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl">
          <button
            onClick={() => setActiveTab('assistant')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'assistant'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Barista Sage</span>
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'menu'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Menu Catalog</span>
          </button>
        </div>

        {/* Dual Column Layout on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: AI Barista Assistant (ADK & RAG) */}
          <div
            className={`lg:col-span-6 xl:col-span-5 ${
              activeTab === 'assistant' ? 'block' : 'hidden lg:block'
            }`}
          >
            <ChatInterface
              activeProfile={activeProfile}
              env={env}
              onOpenCustomizer={(item, initialCustom) =>
                setCustomizingItem({ item, initialCustomization: initialCustom })
              }
              onAddToCartDirect={handleAddToCartDirect}
              onViewTrace={() => setIsTraceOpen(true)}
            />
          </div>

          {/* Right Column: Full Coffee & Food Catalog */}
          <div
            className={`lg:col-span-6 xl:col-span-7 ${
              activeTab === 'menu' ? 'block' : 'hidden lg:block'
            }`}
          >
            <MenuCatalog
              items={menuItems}
              onOpenCustomizer={(item, initialCustom) =>
                setCustomizingItem({ item, initialCustomization: initialCustom })
              }
              onAddToCartDirect={handleAddToCartDirect}
            />
          </div>
        </div>
      </main>

      {/* 4. Footer info */}
      <footer className="border-t border-white/[0.08] bg-zinc-950/90 backdrop-blur-md py-4 px-4 text-center text-xs text-zinc-500 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
            Track 1 Lab 1: Customer-Facing AI Agent • Powered by Google ADK, RAG & Gemini 3.7 Flash
          </p>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <button
              onClick={() => setIsLoyaltyOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-semibold transition flex items-center gap-1"
            >
              <Award className="w-3.5 h-3.5" />
              Loyalty Points ({activeProfile.loyaltyPoints} pts)
            </button>
            <span className="text-zinc-700">•</span>
            <button
              onClick={() => setIsTraceOpen(true)}
              className="hover:text-amber-400 transition"
            >
              ADK Observability Trace
            </button>
            <span className="text-zinc-700">•</span>
            <button
              onClick={() => setIsKnowledgeOpen(true)}
              className="hover:text-amber-400 transition"
            >
              RAG Knowledge Base
            </button>
            <span className="text-zinc-700">•</span>
            <button
              onClick={() => setIsArchOpen(true)}
              className="hover:text-amber-400 transition"
            >
              Cloud Run Blueprint
            </button>
          </div>
        </div>
      </footer>

      {/* 5. Customizer Modal */}
      {customizingItem && (
        <DrinkCustomizerModal
          item={customizingItem.item}
          initialCustomization={customizingItem.initialCustomization}
          onClose={() => setCustomizingItem(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* 6. Order Tray / Cart Drawer */}
      <OrderTray
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        customer={activeProfile}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={() => setCart([])}
        onSubmitOrder={(order) => {
          setActiveOrder(order);
          // Add earned points to customer profile
          if (activeProfile) {
            const updated = {
              ...activeProfile,
              loyaltyPoints: activeProfile.loyaltyPoints + order.pointsEarned
            };
            setActiveProfile(updated);
            setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          }
        }}
      />

      {/* 7. Order Status Simulation Modal with Recharts Sparkline */}
      <OrderStatusModal
        order={activeOrder}
        onClose={() => setActiveOrder(null)}
        onOpenLoyalty={() => {
          setActiveOrder(null);
          setIsLoyaltyOpen(true);
        }}
      />

      {/* 8. Loyalty Points & Spending Analytics Modal (Recharts & Rewards) */}
      <LoyaltyTrackerWidget
        isOpen={isLoyaltyOpen}
        onClose={() => setIsLoyaltyOpen(false)}
        customer={activeProfile}
        onOrderAgain={handleOrderAgain}
        onRedeemReward={handleRedeemReward}
      />

      {/* 9. ADK Trace Inspector Modal */}
      <AdkTraceInspector
        isOpen={isTraceOpen}
        onClose={() => setIsTraceOpen(false)}
        activeProfile={activeProfile}
        env={env}
      />

      {/* 10. RAG Knowledge Viewer Modal */}
      <RagKnowledgeViewer
        isOpen={isKnowledgeOpen}
        onClose={() => setIsKnowledgeOpen(false)}
      />

      {/* 11. Architecture & Lab Info Modal */}
      <ArchitectureInfoModal
        isOpen={isArchOpen}
        onClose={() => setIsArchOpen(false)}
      />

      {/* 12. Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-zinc-900/95 backdrop-blur-xl text-white font-medium text-xs px-4 py-3 rounded-2xl shadow-2xl border border-amber-500/40 animate-in fade-in slide-in-from-bottom-2 duration-150 flex items-center gap-2.5 shadow-amber-500/10">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

