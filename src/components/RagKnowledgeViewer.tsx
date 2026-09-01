import React, { useState, useEffect } from 'react';
import { Sparkles, BookOpen, Tag, Filter, X, Coffee, Layers } from 'lucide-react';
import { RAGChunk } from '../types';
import { RAG_KNOWLEDGE_BASE } from '../../server/ragKnowledgeBase';

interface RagKnowledgeViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RagKnowledgeViewer: React.FC<RagKnowledgeViewerProps> = ({ isOpen, onClose }) => {
  const [chunks, setChunks] = useState<RAGChunk[]>(RAG_KNOWLEDGE_BASE);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/rag/knowledge')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) throw new Error('Non-JSON response');
        return res.json();
      })
      .then((data) => {
        if (data?.documents && data.documents.length > 0) {
          setChunks(data.documents);
        }
      })
      .catch(() => {
        setChunks(RAG_KNOWLEDGE_BASE);
      });
  }, [isOpen]);

  if (!isOpen) return null;

  const categories = ['all', 'flavor_science', 'menu_item', 'brewing_guide', 'dietary_guide', 'seasonal_special'];

  const filteredChunks = chunks.filter((c) => {
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.content.toLowerCase().includes(q) ||
        c.metadata.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900/95 backdrop-blur-2xl border border-white/[0.12] rounded-3xl max-w-4xl w-full text-zinc-100 shadow-2xl p-6 sm:p-7 my-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Grounded Coffee Knowledge Base (RAG Corpus)
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Semantic retrieval vectors for coffee agronomy, brewing chemistry, and dietary protocols
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

        {/* Filter Controls */}
        <div className="my-5 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search knowledge chunks by term (e.g. Yirgacheffe, MCT, L-Theanine, Oat microfoam)..."
              className="flex-1 bg-zinc-950 border border-white/[0.08] rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap capitalize transition-all border ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-lg shadow-amber-500/20'
                    : 'bg-zinc-900 hover:bg-zinc-800 border-white/[0.08] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Documents Grid */}
        <div className="space-y-3">
          <div className="text-xs text-zinc-400 font-semibold font-mono">
            Showing {filteredChunks.length} of {chunks.length} Grounded Chunks:
          </div>

          {filteredChunks.map((chunk) => (
            <div
              key={chunk.id}
              className="bg-zinc-950/80 border border-white/[0.08] rounded-2xl p-4 sm:p-5 space-y-2.5 text-xs hover:border-amber-500/30 transition shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <h4 className="font-display font-bold text-zinc-100 text-sm">{chunk.title}</h4>
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-zinc-900 text-amber-300 border border-white/[0.08] w-fit">
                  {chunk.category.replace('_', ' ')}
                </span>
              </div>

              <p className="text-zinc-300 text-xs leading-relaxed">{chunk.content}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {chunk.metadata.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-400 border border-white/[0.06]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
