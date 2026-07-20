import { axiosInstance } from './axios';

export interface Product {
  id: number;
  category_id: number;
  title: string;
  description: string;
  brand: string;
  image_url: string;
  images?: string[];
  specifications?: Record<string, string>;
  price: number;
  stock: number;
}

export const productApi = {
  getProducts: async (skip: number = 0, limit: number = 10): Promise<Product[]> => {
    const response = await axiosInstance.get(`/products/?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  getProductById: async (id: string | number): Promise<Product> => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },

  searchProducts: async (q: string): Promise<Product[]> => {
    const response = await axiosInstance.get(`/products/search/?q=${encodeURIComponent(q)}`);
    return response.data;
  },

  getByCategory: async (categoryId: string | number): Promise<Product[]> => {
    const response = await axiosInstance.get(`/products/category/${categoryId}`);
    return response.data;
  },

  createProduct: async (data: Omit<Product, 'id'>): Promise<any> => {
    const response = await axiosInstance.post('/products/', data);
    return response.data;
  },

  updateProduct: async (id: number, data: Omit<Product, 'id'>): Promise<any> => {
    const response = await axiosInstance.put(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<any> => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  }
};
