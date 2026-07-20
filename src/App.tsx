import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './routes';
import { useAuthStore } from './store/authStore';
import { useCartStore } from './store/cartStore';
import { useWishlistStore } from './store/wishlistStore';
import { useThemeStore } from './store/themeStore';

const queryClient = new QueryClient();

function App() {
  const { isAuthenticated, fetchUser } = useAuthStore();
  const fetchCart = useCartStore(state => state.fetchCart);
  const fetchWishlist = useWishlistStore(state => state.fetchWishlist);
  const isDark = useThemeStore(state => state.isDark);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchWishlist();
    } else {
      useCartStore.getState().clearCart();
      useWishlistStore.getState().clearWishlist();
    }
  }, [isAuthenticated, fetchCart, fetchWishlist]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
