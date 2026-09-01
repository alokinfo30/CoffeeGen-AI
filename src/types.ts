/**
 * Types and interfaces for the Coffee Shop AI Agent (ADK & RAG on Cloud Run)
 */

export type DietaryTag = 'vegan' | 'dairy-free' | 'gluten-free' | 'keto' | 'low-sugar' | 'nut-free' | 'organic';
export type CaffeineLevel = 'high' | 'medium' | 'low' | 'decaf';
export type DrinkCategory = 'espresso' | 'pour-over' | 'cold-brew' | 'tea-matcha' | 'seasonal' | 'bakery' | 'savory';

export interface MenuItem {
  id: string;
  name: string;
  category: DrinkCategory;
  description: string;
  price: number;
  calories: number;
  caffeineMg: number;
  caffeineLevel: CaffeineLevel;
  flavorNotes: string[];
  roastOrigin?: string;
  dietaryTags: DietaryTag[];
  allergens: string[];
  milkOptions: string[];
  sweetnessLevels: string[];
  temperatureOptions: ('hot' | 'iced')[];
  availableAddOns: { name: string; price: number; calories: number }[];
  inStock: boolean;
  isPopular?: boolean;
  isSeasonal?: boolean;
  image: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  milkPreference: string;
  sweetnessPreference: string;
  caffeineTolerance: CaffeineLevel;
  dietaryRestrictions: string[];
  allergies: string[];
  favoriteFlavorNotes: string[];
  pastOrders: {
    drinkName: string;
    customizations: string;
    rating: number;
    date: string;
  }[];
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'Coffee Master';
  loyaltyPoints: number;
  typicalOrderTime: string;
  budgetPreference: 'budget' | 'standard' | 'premium';
}

export interface CustomizationState {
  size: 'Regular (12oz)' | 'Large (16oz)' | 'Extra Large (20oz)';
  temperature: 'hot' | 'iced';
  milk: string;
  sweetness: string;
  syrups: string[];
  extraShots: number;
  addOns: string[];
  specialInstructions: string;
}

export interface CartItem {
  cartItemId: string;
  item: MenuItem;
  customization: CustomizationState;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  calculatedCalories: number;
  calculatedCaffeine: number;
}

export interface OrderDraft {
  id: string;
  customerId: string;
  customerName: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  pointsEarned: number;
  status: 'draft' | 'received' | 'grinding_beans' | 'brewing' | 'steaming_milk' | 'barista_inspection' | 'ready_for_pickup';
  pickupEstimateMinutes: number;
  createdAt: string;
  notes?: string;
}

export interface RAGChunk {
  id: string;
  title: string;
  category: 'menu_item' | 'brewing_guide' | 'flavor_science' | 'dietary_guide' | 'seasonal_special';
  content: string;
  similarityScore?: number;
  matchedKeywords?: string[];
  metadata: {
    itemId?: string;
    tags: string[];
    origin?: string;
    temperature?: string;
  };
}

export interface ADKTraceStep {
  id: string;
  timestamp: string;
  stage: 'planner' | 'rag_retrieval' | 'tool_invocation' | 'tool_result' | 'reasoning' | 'synthesis';
  title: string;
  description: string;
  data?: Record<string, any>;
  latencyMs?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  recommendedItems?: MenuItem[];
  actionSuggestion?: {
    type: 'add_to_cart' | 'customize' | 'apply_discount';
    item: MenuItem;
    customization?: Partial<CustomizationState>;
  };
  adkTrace?: ADKTraceStep[];
  ragSources?: RAGChunk[];
}

export interface EnvironmentContext {
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  weather: 'crisp_sunny' | 'rainy_chilly' | 'hot_summer';
  temperature: string;
  storeStatus: 'open' | 'peak_rush' | 'happy_hour';
  baristaDailySpecial: string;
}
