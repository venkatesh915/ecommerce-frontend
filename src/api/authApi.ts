import { axiosInstance } from './axios';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = loginSchema.extend({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

export const authApi = {
  login: async (data: LoginFormData) => {
    // The backend uses UserLogin JSON payload
    const response = await axiosInstance.post('/auth/login', {
      email: data.email,
      password: data.password,
    });
    return response.data;
  },
  
  register: async (data: RegisterFormData) => {
    // Matches UserCreate schema
    const response = await axiosInstance.post('/auth/register', {
      email: data.email,
      password: data.password,
      full_name: data.fullName,
      phone: data.phone || null,
    });
    return response.data;
  },
  
  getMe: async () => {
    // The backend user profile endpoint is /user/me
    const response = await axiosInstance.get('/user/me');
    return response.data;
  },

  changePassword: async (data: { current_password: string; new_password: string }) => {
    const response = await axiosInstance.post('/user/change-password', data);
    return response.data;
  }
};
