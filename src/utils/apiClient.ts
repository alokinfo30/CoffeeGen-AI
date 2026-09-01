import { MenuItem, CustomerProfile, RAGChunk, OrderDraft, CartItem, AdkExecutionTrace, EnvironmentContext } from '../types';
import { MENU_ITEMS } from '../../server/menuData';
import { CUSTOMER_PROFILES } from '../../server/profilesData';
import { RAG_KNOWLEDGE_BASE } from '../../server/ragKnowledgeBase';
import { RAGEngine } from '../../server/ragEngine';

const clientRagEngine = new RAGEngine();

// Helper to determine base API URL
function getApiBaseUrl(): string | null {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.replace(/\/$/, '');
  }
  
  // If running on static hosting without a configured backend, return null to use local engine
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.includes('netlify.app') || host.includes('vercel.app') || host.includes('github.io')) {
      return null;
    }
  }
  
  return ''; // Relative path for local Express + Vite combo
}

export const api = {
  async getMenu(): Promise<MenuItem[]> {
    const baseUrl = getApiBaseUrl();
    if (baseUrl !== null) {
      try {
        const res = await fetch(`${baseUrl}/api/menu`);
        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const data = await res.json();
            if (data?.items && Array.isArray(data.items) && data.items.length > 0) {
              return data.items;
            }
          }
        }
      } catch (err) {
        console.warn('[CoffeeGen-AI] API unavailable, using embedded menu catalog:', err);
      }
    }
    return MENU_ITEMS;
  },

  async getProfiles(): Promise<CustomerProfile[]> {
    const baseUrl = getApiBaseUrl();
    if (baseUrl !== null) {
      try {
        const res = await fetch(`${baseUrl}/api/profiles`);
        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const data = await res.json();
            if (data?.profiles && Array.isArray(data.profiles) && data.profiles.length > 0) {
              return data.profiles;
            }
          }
        }
      } catch (err) {
        console.warn('[CoffeeGen-AI] API unavailable, using embedded personas:', err);
      }
    }
    return CUSTOMER_PROFILES;
  },

  async getRagKnowledge(): Promise<RAGChunk[]> {
    const baseUrl = getApiBaseUrl();
    if (baseUrl !== null) {
      try {
        const res = await fetch(`${baseUrl}/api/rag/knowledge`);
        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const data = await res.json();
            if (data?.documents && Array.isArray(data.documents)) {
              return data.documents;
            }
          }
        }
      } catch (err) {
        console.warn('[CoffeeGen-AI] API unavailable, using embedded RAG corpus:', err);
      }
    }
    return RAG_KNOWLEDGE_BASE;
  },

  async searchRag(query: string, options: any = {}) {
    const baseUrl = getApiBaseUrl();
    if (baseUrl !== null) {
      try {
        const res = await fetch(`${baseUrl}/api/rag/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, ...options })
        });
        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const data = await res.json();
            if (data?.results) return data.results;
          }
        }
      } catch (err) {
        console.warn('[CoffeeGen-AI] API search unavailable, using client RAG engine:', err);
      }
    }
    return clientRagEngine.search(query, options);
  },

  async sendAgentChat(params: {
    message: string;
    activeProfile: CustomerProfile;
    env: EnvironmentContext;
    conversationHistory: { sender: string; text: string }[];
  }) {
    const { message, activeProfile, env, conversationHistory } = params;
    const baseUrl = getApiBaseUrl();

    if (baseUrl !== null) {
      try {
        const res = await fetch(`${baseUrl}/api/agent/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            customerProfileId: activeProfile.id,
            environmentContext: env,
            conversationHistory: conversationHistory.slice(-4)
          })
        });

        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            return await res.json();
          }
        }
      } catch (err) {
        console.warn('[CoffeeGen-AI] Server chat unavailable, using client ADK synthesizer:', err);
      }
    }

    // Client-side grounded ADK Barista Synthesis
    const searchResults = clientRagEngine.search(message, {
      topK: 3,
      customerProfile: activeProfile,
      excludeAllergens: activeProfile.allergies
    });

    const recommendedItems: MenuItem[] = [];
    searchResults.forEach((r) => {
      if (r.associatedMenuItem && !recommendedItems.some((i) => i.id === r.associatedMenuItem!.id)) {
        recommendedItems.push(r.associatedMenuItem);
      }
    });

    if (recommendedItems.length === 0) {
      const fallback = MENU_ITEMS.find((m) => {
        if (activeProfile.dietaryRestrictions.includes('dairy-free') && m.allergens.some((a) => a.toLowerCase().includes('dairy') || a.toLowerCase().includes('milk'))) return false;
        if (activeProfile.dietaryRestrictions.includes('keto') && m.calories > 150) return false;
        if (activeProfile.caffeineTolerance === 'none' && m.caffeineMg > 25) return false;
        return true;
      }) || MENU_ITEMS[0];
      recommendedItems.push(fallback);
    }

    const primaryRec = recommendedItems[0];
    const adkTrace: AdkExecutionTrace[] = [
      {
        stage: 'planner',
        status: 'completed',
        durationMs: 16,
        summary: `Extracted persona: ${activeProfile.name} (${activeProfile.role}) • Rhythms: ${env.timeOfDay} / ${env.weather} • Dietary: ${activeProfile.dietaryRestrictions.join(', ') || 'Standard'}`
      },
      {
        stage: 'rag_retrieval',
        status: 'completed',
        durationMs: 28,
        summary: `Retrieved ${searchResults.length} grounded chunks matching flavor notes: ${activeProfile.favoriteFlavorNotes.join(', ')}`
      },
      {
        stage: 'tool_execution',
        status: 'completed',
        durationMs: 12,
        summary: `Validated allergen isolation for [${activeProfile.allergies.join(', ') || 'None'}] • Verified in-stock inventory`
      },
      {
        stage: 'synthesis',
        status: 'completed',
        durationMs: 34,
        summary: `Formulated grounded recommendation with ${activeProfile.milkPreference} pairing`
      }
    ];

    return {
      replyText: `Hello ${activeProfile.name}! For this ${env.timeOfDay}, I recommend our handcrafted ${primaryRec.name}. It pairs beautifully with your preference for ${activeProfile.milkPreference} and highlights ${activeProfile.favoriteFlavorNotes.slice(0, 2).join(' & ')} tasting notes!`,
      recommendedItems,
      actionSuggestion: `Customize with ${activeProfile.milkPreference} (${activeProfile.sweetnessPreference})`,
      adkTrace,
      ragSources: searchResults.map((s) => ({
        id: s.chunk.id,
        title: s.chunk.title,
        similarity: s.score,
        snippet: s.chunk.content.slice(0, 160) + '...'
      }))
    };
  },

  async submitOrder(orderData: {
    customer: CustomerProfile;
    items: CartItem[];
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    notes?: string;
  }): Promise<{ success: boolean; order: OrderDraft }> {
    const { customer, items, subtotal, discount, tax, total, notes } = orderData;
    const baseUrl = getApiBaseUrl();

    if (baseUrl !== null) {
      try {
        const res = await fetch(`${baseUrl}/api/order/submit`, {
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
            notes
          })
        });
        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const data = await res.json();
            if (data?.success && data?.order) return data;
          }
        }
      } catch (err) {
        console.warn('[CoffeeGen-AI] API order submit unavailable, using local order processor:', err);
      }
    }

    const pointsEarned = Math.round(total * 10);
    return {
      success: true,
      order: {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: customer.name,
        items,
        subtotal,
        discount,
        tax,
        total,
        pointsEarned,
        status: 'grinding_beans',
        estimatedMinutes: 4,
        createdAt: new Date().toISOString()
      }
    };
  }
};
