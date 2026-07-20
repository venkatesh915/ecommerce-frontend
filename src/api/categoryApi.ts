import { axiosInstance } from './axios';

export interface Category {
  id: number;
  name: string;
  description: string;
  image_url?: string;
}

export const categoryApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await axiosInstance.get('/categories/');
    return response.data;
  },

  getCategoryById: async (id: string | number): Promise<Category> => {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data;
  },

  createCategory: async (data: Omit<Category, 'id'>): Promise<any> => {
    const response = await axiosInstance.post('/categories/', data);
    return response.data;
  },

  updateCategory: async (id: number, data: Omit<Category, 'id'>): Promise<any> => {
    const response = await axiosInstance.put(`/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: number): Promise<any> => {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return response.data;
  }
};
