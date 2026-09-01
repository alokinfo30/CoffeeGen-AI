import { CustomerProfile } from '../src/types';

export const CUSTOMER_PROFILES: CustomerProfile[] = [
  {
    id: 'alex-morgan',
    name: 'Alex Morgan',
    role: 'UX Designer & Afternoon Regular',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    bio: 'Lactose intolerant, loves oat milk specialty lattes with comforting spices and smooth honey. Prefers iced drinks in the afternoon.',
    milkPreference: 'Oat Milk (Default)',
    sweetnessPreference: '50% Half Sweet',
    caffeineTolerance: 'medium',
    dietaryRestrictions: ['dairy-free'],
    allergies: ['dairy', 'cow milk'],
    favoriteFlavorNotes: ['wild honey', 'sweet cinnamon', 'toasted oats', 'vanilla'],
    pastOrders: [
      {
        drinkName: 'Honey Cinnamon Oat Latte (Iced)',
        customizations: 'Oat milk, half sweet, light ice',
        rating: 5,
        date: 'Yesterday, 2:15 PM'
      },
      {
        drinkName: 'Ceremonial Uji Matcha Oat Latte',
        customizations: 'Oat milk, light vanilla syrup',
        rating: 4.8,
        date: '3 days ago, 11:30 AM'
      }
    ],
    loyaltyTier: 'Gold',
    loyaltyPoints: 340,
    typicalOrderTime: '1:30 PM - 3:00 PM',
    budgetPreference: 'standard'
  },
  {
    id: 'maya-chen',
    name: 'Dr. Maya Chen',
    role: 'Bio-tech Researcher & Coffee Purist',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    bio: 'Follows strict Ketogenic diet. Passionate about single-origin light roasts, floral terroir, high caffeine and zero added sugar.',
    milkPreference: 'None / Black (Recommended)',
    sweetnessPreference: 'Unsweetened (Keto Standard)',
    caffeineTolerance: 'high',
    dietaryRestrictions: ['keto', 'low-sugar', 'gluten-free'],
    allergies: ['artificial sweeteners'],
    favoriteFlavorNotes: ['jasmine blossom', 'bergamot', 'white peach', 'dark cocoa'],
    pastOrders: [
      {
        drinkName: 'Ethiopian Yirgacheffe Pour-Over (V60)',
        customizations: 'Hot, black, artisan server',
        rating: 5,
        date: 'Today, 8:15 AM'
      },
      {
        drinkName: 'Keto Brain-Fuel MCT Americano',
        customizations: 'Extra hot, grass-fed ghee, collagen boost',
        rating: 4.9,
        date: '2 days ago, 7:45 AM'
      }
    ],
    loyaltyTier: 'Coffee Master',
    loyaltyPoints: 890,
    typicalOrderTime: '7:30 AM - 9:00 AM',
    budgetPreference: 'premium'
  },
  {
    id: 'liam-rodriguez',
    name: 'Liam Rodriguez',
    role: 'Freelance Writer & Cozy Sipper',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    bio: 'Very sensitive to caffeine after 1 PM. Switched to Swiss Water Decaf and herbal refreshers. Loves warm pastries and vegan baked goods.',
    milkPreference: 'Almond Milk',
    sweetnessPreference: 'Subtle Sweet (Default)',
    caffeineTolerance: 'decaf',
    dietaryRestrictions: ['vegan', 'nut-free'],
    allergies: ['peanuts (safe with almond/walnut)'],
    favoriteFlavorNotes: ['milk chocolate', 'roasted hazelnut', 'tart hibiscus', 'ripe banana'],
    pastOrders: [
      {
        drinkName: 'Swiss Water Decaf Velvet Flat White',
        customizations: 'Oat milk, cardamom spice dusting',
        rating: 5,
        date: 'Yesterday, 3:45 PM'
      },
      {
        drinkName: 'Sparkling Hibiscus Yuzu Botanicals',
        customizations: 'Iced, light agave, fresh mint',
        rating: 4.7,
        date: '4 days ago, 4:10 PM'
      }
    ],
    loyaltyTier: 'Silver',
    loyaltyPoints: 180,
    typicalOrderTime: '2:30 PM - 5:00 PM',
    budgetPreference: 'standard'
  },
  {
    id: 'sam-patel',
    name: 'Sam Patel',
    role: 'Computer Science Student',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    bio: 'Values high energy per dollar, study session fuel, loves nitro cold brews with salted cold foam or double strength matcha.',
    milkPreference: 'Oat Milk (Default)',
    sweetnessPreference: '100% Standard',
    caffeineTolerance: 'high',
    dietaryRestrictions: ['vegetarian'],
    allergies: [],
    favoriteFlavorNotes: ['dark chocolate', 'sea salt', 'vanilla', 'creamy'],
    pastOrders: [
      {
        drinkName: 'Nitro Cold Brew with Salted Cream Foam',
        customizations: 'Extra ice, large size',
        rating: 5,
        date: 'Yesterday, 10:15 AM'
      },
      {
        drinkName: 'Honey Cinnamon Oat Latte',
        customizations: 'Double espresso shot added',
        rating: 4.8,
        date: '3 days ago, 9:00 AM'
      }
    ],
    loyaltyTier: 'Bronze',
    loyaltyPoints: 120,
    typicalOrderTime: '10:00 AM - 1:00 PM',
    budgetPreference: 'budget'
  }
];
