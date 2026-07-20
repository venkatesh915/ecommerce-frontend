import { axiosInstance } from './axios';

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    title: string;
    image_url: string;
  };
}

export interface Order {
  id: number;
  user_id: number;
  address_id: number;
  total_amount: number;
  status: string;
  payment_method: string;
  tracking_number: string | null;
  estimated_delivery_time?: string | null;
  destination_distance?: number | null;
  items: OrderItem[];
}

export const orderApi = {
  placeOrder: async (addressId: number, paymentMethod: string) => {
    // The backend uses query parameters for address_id and payment_method
    const response = await axiosInstance.post(`/orders/place?address_id=${addressId}&payment_method=${paymentMethod}`);
    return response.data;
  },

  getOrders: async (): Promise<Order[]> => {
    const response = await axiosInstance.get('/orders/');
    return response.data;
  },

  getOrderById: async (orderId: string | number): Promise<Order> => {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response.data;
  }
};
