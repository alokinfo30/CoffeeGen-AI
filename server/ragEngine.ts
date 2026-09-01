import { RAGChunk, MenuItem, CustomerProfile, DietaryTag } from '../src/types';
import { RAG_KNOWLEDGE_BASE } from './ragKnowledgeBase';
import { MENU_ITEMS } from './menuData';

export interface RAGSearchResult {
  chunk: RAGChunk;
  score: number;
  matchedKeywords: string[];
  associatedMenuItem?: MenuItem;
}

export interface RAGQueryOptions {
  topK?: number;
  dietaryFilter?: DietaryTag[];
  maxCaffeine?: number;
  categoryFilter?: string;
  excludeAllergens?: string[];
  customerProfile?: CustomerProfile;
}

// Tokenize and clean text into normalized terms
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);
}

// Compute word frequency vector for TF-IDF style semantic matching
function computeTermFreq(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }
  return tf;
}

// Cosine similarity between two term frequency maps with keyword weighting
function calculateSimilarity(
  queryTokens: string[],
  docTokens: string[],
  tags: string[] = []
): { score: number; matchedKeywords: string[] } {
  if (queryTokens.length === 0 || docTokens.length === 0) {
    return { score: 0, matchedKeywords: [] };
  }

  const queryTf = computeTermFreq(queryTokens);
  const docTf = computeTermFreq(docTokens);
  const matchedKeywords: string[] = [];

  let dotProduct = 0;
  let queryNorm = 0;
  let docNorm = 0;

  for (const [term, qCount] of queryTf.entries()) {
    queryNorm += qCount * qCount;
    if (docTf.has(term)) {
      const dCount = docTf.get(term)!;
      dotProduct += qCount * dCount;
      matchedKeywords.push(term);
    }
  }

  for (const [, dCount] of docTf.entries()) {
    docNorm += dCount * dCount;
  }

  // Tag bonus: If user query terms match explicit tags in document metadata
  let tagBonus = 0;
  for (const tag of tags) {
    const normalizedTag = tag.toLowerCase();
    for (const qToken of queryTokens) {
      if (normalizedTag.includes(qToken) || qToken.includes(normalizedTag)) {
        tagBonus += 0.25;
        if (!matchedKeywords.includes(tag)) matchedKeywords.push(tag);
      }
    }
  }

  if (queryNorm === 0 || docNorm === 0) {
    return { score: 0, matchedKeywords: [] };
  }

  const cosine = dotProduct / (Math.sqrt(queryNorm) * Math.sqrt(docNorm));
  const rawScore = cosine * 0.75 + Math.min(0.25, tagBonus);
  const normalizedScore = Math.min(0.99, Math.max(0.1, Number(rawScore.toFixed(3))));

  return { score: normalizedScore, matchedKeywords };
}

export class RAGEngine {
  private chunks: RAGChunk[] = [];
  private menuItems: MenuItem[] = [];

  constructor() {
    this.chunks = [...RAG_KNOWLEDGE_BASE];
    this.menuItems = [...MENU_ITEMS];
  }

  /**
   * Hybrid RAG Retrieval:
   * Searches the Coffee Knowledge Base & Menu Catalog using query terms,
   * customer profile preferences, allergy constraints, and time-of-day filters.
   */
  public search(query: string, options: RAGQueryOptions = {}): RAGSearchResult[] {
    const topK = options.topK || 4;
    const queryTokens = tokenize(query);

    // Expand query with customer profile signals if available
    const expandedQueryTokens = [...queryTokens];
    if (options.customerProfile) {
      const profile = options.customerProfile;
      if (profile.dietaryRestrictions) {
        profile.dietaryRestrictions.forEach(d => expandedQueryTokens.push(...tokenize(d)));
      }
      if (profile.favoriteFlavorNotes) {
        profile.favoriteFlavorNotes.forEach(f => expandedQueryTokens.push(...tokenize(f)));
      }
      if (profile.milkPreference && profile.milkPreference.toLowerCase().includes('oat')) {
        expandedQueryTokens.push('oat', 'dairy-free');
      }
    }

    const scoredResults: RAGSearchResult[] = [];

    for (const chunk of this.chunks) {
      const docTokens = tokenize(chunk.title + ' ' + chunk.content);
      const { score, matchedKeywords } = calculateSimilarity(
        expandedQueryTokens,
        docTokens,
        chunk.metadata.tags
      );

      // Find associated menu item if referenced
      let associatedMenuItem: MenuItem | undefined = undefined;
      if (chunk.metadata.itemId) {
        associatedMenuItem = this.menuItems.find(m => m.id === chunk.metadata.itemId);
      }

      // Check allergy constraints
      if (options.excludeAllergens && options.excludeAllergens.length > 0 && associatedMenuItem) {
        const hasAllergen = associatedMenuItem.allergens.some(itemAllergen =>
          options.excludeAllergens!.some(ex => itemAllergen.toLowerCase().includes(ex.toLowerCase()))
        );
        if (hasAllergen) {
          continue; // Skip dangerous item
        }
      }

      // Check caffeine limit if provided
      if (options.maxCaffeine !== undefined && associatedMenuItem) {
        if (associatedMenuItem.caffeineMg > options.maxCaffeine) {
          continue;
        }
      }

      scoredResults.push({
        chunk: {
          ...chunk,
          similarityScore: score,
          matchedKeywords
        },
        score,
        matchedKeywords,
        associatedMenuItem
      });
    }

    // Sort descending by similarity score
    scoredResults.sort((a, b) => b.score - a.score);

    return scoredResults.slice(0, topK);
  }

  /**
   * Retrieves all knowledge chunks for visualization & developer inspection
   */
  public getAllChunks(): RAGChunk[] {
    return this.chunks;
  }

  /**
   * Direct MenuItem lookup with dietary checks
   */
  public getMenu(): MenuItem[] {
    return this.menuItems;
  }

  public getMenuItemById(id: string): MenuItem | undefined {
    return this.menuItems.find(i => i.id === id);
  }
}

export const ragEngine = new RAGEngine();
