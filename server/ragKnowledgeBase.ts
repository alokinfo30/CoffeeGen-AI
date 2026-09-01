import { RAGChunk } from '../src/types';

export const RAG_KNOWLEDGE_BASE: RAGChunk[] = [
  {
    id: 'rag-doc-ethiopian-yirgacheffe',
    title: 'Single-Origin Ethiopian Yirgacheffe Flavor & Extraction Profile',
    category: 'flavor_science',
    content: 'Ethiopian Yirgacheffe beans are grown at 2,100 meters elevation in the Gedeo Zone. Washed processing reveals delicate tea-like body with pronounced jasmine blossom aromatics, bergamot citrus, and honeyed peach acidity. Best brewed at 92-94°C via V60 or Chemex pour-over. Pairs exquisitely with citrus bakery items like Meyer Lemon Tartine or Lemon shortbread. Ideal for black coffee connoisseurs and keto/low-calorie seekers.',
    metadata: {
      itemId: 'single-origin-ethiopian-pourover',
      tags: ['single-origin', 'light-roast', 'floral', 'pour-over', 'black-coffee', 'keto', 'vegan'],
      origin: 'Ethiopia Gedeo Zone',
      temperature: 'hot/iced'
    }
  },
  {
    id: 'rag-doc-oat-milk-honey-cinnamon',
    title: 'Oat Milk Microfoam Chemistry & Spice Pairing',
    category: 'menu_item',
    content: 'Our Honey Cinnamon Oat Latte pairs high-density oat milk (steamed to 60°C to preserve natural maltose sweetness without curdling) with raw wildflower honey and freshly grated Saigon cinnamon. Saigon cinnamon contains high cinnamaldehyde which naturally enhances the perception of sweetness while regulating blood glucose spikes. 100% dairy-free, rich in beta-glucans, and the highest rated drink among afternoon regulars.',
    metadata: {
      itemId: 'honey-cinnamon-oat-latte',
      tags: ['oat-milk', 'dairy-free', 'honey', 'cinnamon', 'latte', 'afternoon', 'low-acid'],
      temperature: 'hot/iced'
    }
  },
  {
    id: 'rag-doc-nitro-cold-brew-science',
    title: 'Nitro Cold Brew Cascade & Caffeine Extraction Dynamics',
    category: 'brewing_guide',
    content: 'Cold brew steep cycles run 20 hours at 4°C using medium-coarse Huila Colombian Supremo beans. Cold temperature brewing reduces chlorogenic acid breakdown, yielding 67% lower titratable acidity compared to hot brewed coffee. Pressurized food-grade nitrogen creates micro-bubbles that produce a velvet guinness-like head without adding any milk or sugar. Delivering 280mg caffeine per 16oz, it provides long-lasting sustained alertness without jitters.',
    metadata: {
      itemId: 'nitro-cold-brew-salted-foam',
      tags: ['cold-brew', 'nitro', 'high-caffeine', 'energy', 'low-acid', 'salted-caramel'],
      temperature: 'iced'
    }
  },
  {
    id: 'rag-doc-uji-matcha-l-theanine',
    title: 'Uji Ceremonial Matcha & L-Theanine Focus Synergies',
    category: 'flavor_science',
    content: 'Shaded-grown Gyokuro tencha leaves from Uji, Kyoto contain up to 5 times more L-Theanine than regular green tea. L-theanine crosses the blood-brain barrier to trigger alpha brain waves, creating relaxed alertness that smooths out caffeine uptake. With 70mg of clean caffeine, Ceremonial Matcha Oat Latte is the gold standard for customers experiencing coffee jitters, acid sensitivity, or needing sustained cognitive focus during late morning and afternoon work sessions.',
    metadata: {
      itemId: 'ceremonial-matcha-oat-latte',
      tags: ['matcha', 'antioxidants', 'l-theanine', 'clean-energy', 'dairy-free', 'focus', 'gentle-caffeine'],
      temperature: 'hot/iced'
    }
  },
  {
    id: 'rag-doc-swiss-water-decaf-process',
    title: 'Swiss Water Decaffeination & Afternoon Relaxation Guide',
    category: 'dietary_guide',
    content: 'Our Decaf Velvet Flat White uses 100% chemical-free Swiss Water Process beans from Antioquia, Colombia. Using pure green coffee extract and carbon filtering, 99.9% of caffeine is removed while preserving volatile flavor compounds, chocolate notes, and sweet lipids. Pulls thick, golden crema. Recommended for any customer sensitive to caffeine, pregnant customers, or anyone placing orders after 2:00 PM seeking deep sleep hygiene.',
    metadata: {
      itemId: 'swiss-water-decaf-flat-white',
      tags: ['decaf', 'swiss-water', 'zero-caffeine', 'sleep-friendly', 'afternoon', 'flat-white'],
      temperature: 'hot/iced'
    }
  },
  {
    id: 'rag-doc-keto-mct-bulletproof-science',
    title: 'Ketogenic Energy: C8 MCT Fatty Acid & Fasting Synergies',
    category: 'dietary_guide',
    content: 'The Keto Brain-Fuel Americano combines high-altitude Sumatra espresso with pure C8 caprylic acid MCT oil and grass-fed A2 ghee. C8 MCT bypasses traditional digestion and converts directly to ketone bodies in the liver within 15 minutes, providing instant cerebral fuel without breaking ketosis or causing insulin spikes. Net carbs: 0g. Satiety index: 4+ hours. Ideal for intermittent fasters, keto athletes, and high-performance morning routines.',
    metadata: {
      itemId: 'keto-mct-bulletproof-americano',
      tags: ['keto', 'mct-oil', 'low-carb', 'zero-sugar', 'fat-fueled', 'gluten-free', 'high-caffeine'],
      temperature: 'hot'
    }
  },
  {
    id: 'rag-doc-pistachio-rose-cortado',
    title: 'Artisanal Pistachio Paste & Floral Cortado Emulsion',
    category: 'seasonal_special',
    content: 'The Pistachio Rose Cortado features an equal 1:1 ratio of double ristretto espresso and steamed silky almond milk blended with 100% pure roasted Sicilian Bronte pistachio paste. The rich monounsaturated fats in pistachio balance the dark cocoa and cedar notes of the espresso roast, crowned with fragrant culinary-grade Persian rose water. Delivers a sophisticated Mediterranean dessert experience with moderate calories (110 kcal).',
    metadata: {
      itemId: 'spanish-pistachio-cortado',
      tags: ['pistachio', 'cortado', 'rose', 'seasonal', 'nutty', 'specialty-latte'],
      temperature: 'hot/iced'
    }
  },
  {
    id: 'rag-doc-hibiscus-yuzu-botanicals',
    title: 'Hydration & Antioxidant Refresher: Hibiscus Sabdariffa & Yuzu',
    category: 'dietary_guide',
    content: 'Brewed from whole sun-dried Hibiscus sabdariffa flowers from Oaxaca rich in anthocyanins and vitamin C, blended with fresh cold-pressed Japanese Yuzu citrus and sparkling mineral water. Completely caffeine-free, zero artificial coloring, and under 45 calories. Exceptionally thirst-quenching on hot sunny days or as a late afternoon hydration reset with zero sleep interference.',
    metadata: {
      itemId: 'hibiscus-yuzu-sparkling-refresher',
      tags: ['refresher', 'hibiscus', 'yuzu', 'zero-caffeine', 'hydrating', 'low-calorie', 'sparkling'],
      temperature: 'iced'
    }
  },
  {
    id: 'rag-doc-bourbon-barrel-aged-special',
    title: 'Limited Reserve Smoked Bourbon Vanilla Cold Brew',
    category: 'seasonal_special',
    content: 'Guatemalan Huehuetenango green coffee beans aged for 60 days in charred American white oak Kentucky bourbon barrels prior to roasting. During cold brewing, the beans release caramel, smoked bourbon vanilla, toasted oak, and candied orange peel notes with 0.0% ABV. A rich, artisanal indulgence for afternoon coffee lovers wanting deep complex barrel flavor without alcohol.',
    metadata: {
      itemId: 'smoked-vanilla-bourbon-cold-brew',
      tags: ['bourbon-barrel', 'seasonal', 'cold-brew', 'vanilla', 'smoked', 'craft-reserve'],
      temperature: 'iced'
    }
  },
  {
    id: 'rag-doc-food-pairing-matrix',
    title: 'Barista Food & Beverage Flavor Pairing Principles',
    category: 'flavor_science',
    content: 'Expert pairing guidelines: 1) Floral & Citric pour-overs (Ethiopian Yirgacheffe) pair harmoniously with Meyer Lemon Tartines and Berry pastries to complement bright acids. 2) Rich, chocolatey cold brews and dark espresso lattes pair with warm Vegan Banana Walnut Loaves or Almond Croissants because lipids and toasted nuts round out espresso bitterness. 3) Savory Avocado Tartines provide rich potassium and healthy fats that balance strong espresso acidity.',
    metadata: {
      tags: ['food-pairing', 'pastry', 'flavor-matrix', 'avocado-toast', 'banana-bread', 'croissant']
    }
  },
  {
    id: 'rag-doc-allergens-and-dairy-substitutions',
    title: 'Dietary Protocol: Dairy, Gluten, and Nut Allergy Safeguards',
    category: 'dietary_guide',
    content: 'Coffee Shop Allergy Protocols: For lactose intolerance or dairy allergy, recommend Barista-edition Oat Milk (Minor Figures/Oatly) or Almond Milk with dedicated steaming wands. For nut allergies, ensure customers avoid Pistachio Cortado and Almond Croissant; oat milk is 100% nut-free. For gluten sensitivities, highlight Avocado Tartine with gluten-free seed bread modification, or clean beverages which are naturally 100% gluten-free.',
    metadata: {
      tags: ['allergies', 'dairy-free', 'gluten-free', 'nut-free', 'safety', 'milk-alternatives']
    }
  }
];
