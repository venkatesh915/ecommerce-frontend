import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/api/productApi';

interface RecentlyViewedState {
  items: Product[];
  addItem: (product: Product) => void;
  clearItems: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) => 
        set((state) => {
          // Remove if it already exists to prevent duplicates
          const filteredItems = state.items.filter((item) => item.id !== product.id);
          // Add to the front of the array and keep only the last 15 items
          return { items: [product, ...filteredItems].slice(0, 15) };
        }),
      clearItems: () => set({ items: [] }),
    }),
    {
      name: 'recently-viewed-storage',
    }
  )
);
