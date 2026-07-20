import { create } from 'zustand';
import { cartApi } from '@/api/cartApi';
import type { HydratedCartItem } from '@/api/cartApi';

interface CartState {
  items: HydratedCartItem[];
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const items = await cartApi.getCart();
      set({ items, isLoading: false });
    } catch (error) {
      set({ items: [], isLoading: false });
    }
  },

  addItem: async (productId: number, quantity: number) => {
    await cartApi.addToCart(productId, quantity);
    await get().fetchCart();
  },

  removeItem: async (cartItemId: number) => {
    await cartApi.removeItem(cartItemId);
    await get().fetchCart();
  },

  updateQuantity: async (cartItemId: number, quantity: number) => {
    if (quantity <= 0) {
      await get().removeItem(cartItemId);
      return;
    }
    await cartApi.updateQuantity(cartItemId, quantity);
    await get().fetchCart();
  },

  clearCart: () => set({ items: [] }),

  getTotal: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  }
}));
