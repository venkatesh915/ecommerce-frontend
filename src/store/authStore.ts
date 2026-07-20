import { create } from 'zustand';
import { authApi } from '@/api/authApi';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'user' | 'admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
  fetchUser: async () => {
    const token = get().token;
    if (token) {
      try {
        const userData = await authApi.getMe();
        set({ user: userData, isAuthenticated: true });
      } catch (err) {
        // Handled by axios interceptor if 401
      }
    }
  }
}));
