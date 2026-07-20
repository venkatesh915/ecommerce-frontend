import { create } from 'zustand';
import { wishlistApi } from '@/api/wishlistApi';
import type { HydratedCartItem } from '@/api/cartApi';

interface WishlistState {
  items: HydratedCartItem[];
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  addItem: (productId: number) => Promise<void>;
  removeItem: (wishlistItemId: number) => Promise<void>;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const items = await wishlistApi.getWishlist();
      set({ items, isLoading: false });
    } catch (error) {
      set({ items: [], isLoading: false });
    }
  },

  addItem: async (productId: number) => {
    await wishlistApi.addToWishlist(productId);
    await get().fetchWishlist();
  },

  removeItem: async (wishlistItemId: number) => {
    await wishlistApi.removeWishlist(wishlistItemId);
    await get().fetchWishlist();
  },

  clearWishlist: () => set({ items: [] })
}));
