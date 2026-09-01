import React, { useState } from 'react';
import {
  Search,
  Filter,
  Flame,
  Zap,
  Plus,
  Sliders,
  Sparkles,
  Coffee,
  Check,
  X
} from 'lucide-react';
import { MenuItem, DrinkCategory, DietaryTag, CustomizationState } from '../types';

interface MenuCatalogProps {
  items: MenuItem[];
  onOpenCustomizer: (item: MenuItem, initialCustomization?: Partial<CustomizationState>) => void;
  onAddToCartDirect: (item: MenuItem) => void;
}

export const MenuCatalog: React.FC<MenuCatalogProps> = ({
  items,
  onOpenCustomizer,
  onAddToCartDirect
}) => {
  const [selectedCategory, setSelectedCategory] = useState<DrinkCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDietary, setSelectedDietary] = useState<DietaryTag[]>([]);

  const categories: { id: DrinkCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Items' },
    { id: 'espresso', label: 'Espresso' },
    { id: 'pour-over', label: 'Pour-Over' },
    { id: 'cold-brew', label: 'Cold Brew' },
    { id: 'tea-matcha', label: 'Tea & Matcha' },
    { id: 'seasonal', label: 'Seasonal' },
    { id: 'bakery', label: 'Bakery' },
    { id: 'savory', label: 'Savory' }
  ];

  const dietaryFilters: DietaryTag[] = [
    'vegan',
    'dairy-free',
    'gluten-free',
    'keto',
    'low-sugar',
    'organic'
  ];

  const toggleDietary = (tag: DietaryTag) => {
    if (selectedDietary.includes(tag)) {
      setSelectedDietary(selectedDietary.filter((t) => t !== tag));
    } else {
      setSelectedDietary([...selectedDietary, tag]);
    }
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    // Category check
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchNotes = item.flavorNotes.some((n) => n.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchNotes) return false;
    }

    // Dietary tags
    if (selectedDietary.length > 0) {
      const hasAllSelected = selectedDietary.every((tag) =>
        item.dietaryTags.includes(tag)
      );
      if (!hasAllSelected) return false;
    }

    return true;
  });

  return (
    <div className="space-y-4">
      {/* Category Tabs & Search */}
      <div className="bg-zinc-900/70 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-4 sm:p-5 space-y-3.5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coffee, notes (floral, oat, chocolate)..."
              className="w-full bg-zinc-950 border border-white/[0.08] rounded-2xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Item count badge */}
          <div className="text-xs text-zinc-400 px-2 flex items-center gap-1.5 self-end sm:self-auto font-medium">
            <Coffee className="w-3.5 h-3.5 text-amber-400" />
            <span>Showing <strong className="text-zinc-200">{filteredItems.length}</strong> items</span>
          </div>
        </div>

        {/* Category Pill Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-lg shadow-amber-500/20'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-white/[0.08] text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Dietary Filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/[0.06] text-xs">
          <span className="text-zinc-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3 text-amber-400" />
            Filter:
          </span>
          {dietaryFilters.map((tag) => {
            const isChecked = selectedDietary.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleDietary(tag)}
                className={`text-[11px] px-3 py-1 rounded-full border transition flex items-center gap-1.5 ${
                  isChecked
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/10'
                    : 'bg-zinc-950/80 border-white/[0.08] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {isChecked && <Check className="w-3 h-3 text-emerald-400" />}
                <span className="capitalize">{tag}</span>
              </button>
            );
          })}
          {selectedDietary.length > 0 && (
            <button
              onClick={() => setSelectedDietary([])}
              className="text-[11px] text-zinc-400 hover:text-amber-300 underline ml-2 transition"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-zinc-900/80 backdrop-blur-md border border-white/[0.08] hover:border-amber-500/40 rounded-3xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col justify-between group"
          >
            {/* Top Image & Badges */}
            <div className="relative h-40 bg-zinc-950 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-black/40" />

              {/* Price Tag */}
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-zinc-950/85 backdrop-blur-md border border-amber-500/30 text-amber-300 font-mono font-bold text-xs shadow-lg">
                ${item.price.toFixed(2)}
              </div>

              {/* Category & Seasonal */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-zinc-950/80 backdrop-blur-md text-zinc-300 border border-white/[0.1]">
                  {item.category}
                </span>
                {item.isSeasonal && (
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-amber-500/30 backdrop-blur-md text-amber-200 border border-amber-500/50 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                    Seasonal
                  </span>
                )}
              </div>

              {/* Title on Image */}
              <div className="absolute bottom-2.5 left-4 right-4">
                <h3 className="font-display text-base font-bold text-white truncate drop-shadow-sm">{item.name}</h3>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              {/* Flavor tags */}
              <div className="flex flex-wrap gap-1.5">
                {item.flavorNotes.map((note) => (
                  <span
                    key={note}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-950 text-zinc-400 border border-white/[0.06]"
                  >
                    #{note}
                  </span>
                ))}
              </div>

              {/* Nutritional & Origin metadata */}
              <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.06] text-[11px] text-zinc-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-zinc-300 font-medium">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    {item.calories} kcal
                  </span>
                  <span className="text-zinc-700">•</span>
                  <span className="flex items-center gap-1 text-zinc-300 font-medium">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    {item.caffeineMg}mg
                  </span>
                </div>
                {item.roastOrigin && (
                  <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[130px]" title={item.roastOrigin}>
                    {item.roastOrigin.split(',')[0]}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onAddToCartDirect(item)}
                  id={`btn-quick-add-${item.id}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-amber-500/15"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Quick Add</span>
                </button>
                <button
                  onClick={() => onOpenCustomizer(item)}
                  id={`btn-customize-${item.id}`}
                  className="py-2 px-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/[0.08] text-xs font-semibold flex items-center gap-1.5 transition"
                  title="Customize drink recipe & modifiers"
                >
                  <Sliders className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Customize</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
