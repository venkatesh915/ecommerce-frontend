import { axiosInstance } from './axios';
import type { Product } from './productApi';
import type { Order } from './orderApi';

export interface UserAdmin {
  id: number;
  full_name: string;
  email: string;
  role: string;
}

export interface SalesSummary {
  total_orders: number;
  total_revenue: number;
}

export const adminApi = {
  getUsers: async (): Promise<UserAdmin[]> => {
    const response = await axiosInstance.get('/admin/users');
    return response.data;
  },

  getProducts: async (): Promise<Product[]> => {
    const response = await axiosInstance.get('/admin/products');
    return response.data;
  },

  getOrders: async (): Promise<Order[]> => {
    const response = await axiosInstance.get('/admin/orders');
    return response.data;
  },

  getSalesSummary: async (): Promise<SalesSummary> => {
    const response = await axiosInstance.get('/admin/sales');
    return response.data;
  },

  updateUserRole: async (userId: number, role: string) => {
    const response = await axiosInstance.put(`/admin/users/${userId}/role?role=${role}`);
    return response.data;
  },

  updateOrderStatus: async (orderId: number, status: string) => {
    const response = await axiosInstance.put(`/admin/orders/${orderId}/status?status=${status}`);
    return response.data;
  }
};
