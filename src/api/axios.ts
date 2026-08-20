import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

// const BASE_URL = import.meta.env.VITE_API_URL || 'https://ecommerce-backend-production-b444.up.railway.app';


const BASE_URL = import.meta.env.VITE_API_URL || 'https://ecommerce-backend-86vx.onrender.com';


export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 Unauthorized globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.endsWith('/auth/login')) {
      // Token expired or unauthorized
      useAuthStore.getState().logout();
      // Let React Router ProtectedRoutes handle the redirect instead of hard page reload
    }
    return Promise.reject(error);
  }
);
