import { axiosInstance } from './axios';

export interface Address {
  id: number;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

export type AddressCreate = Omit<Address, 'id' | 'is_default'>;

export const addressApi = {
  getAddresses: async (): Promise<Address[]> => {
    const response = await axiosInstance.get('/address/');
    return response.data;
  },

  createAddress: async (data: AddressCreate) => {
    const response = await axiosInstance.post('/address/', data);
    return response.data;
  },

  updateAddress: async (id: number, data: Partial<AddressCreate>) => {
    const response = await axiosInstance.put(`/address/${id}`, data);
    return response.data;
  },

  deleteAddress: async (id: number) => {
    const response = await axiosInstance.delete(`/address/${id}`);
    return response.data;
  },

  setDefaultAddress: async (id: number) => {
    const response = await axiosInstance.put(`/address/default/${id}`);
    return response.data;
  }
};
