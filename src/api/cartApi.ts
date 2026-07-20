import { axiosInstance } from './axios';
import { productApi } from './productApi';

export interface CartItemResponse {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
}

export interface HydratedCartItem {
  id: number; // product id
  cart_item_id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export const cartApi = {
  getCart: async (): Promise<HydratedCartItem[]> => {
    const response = await axiosInstance.get('/cart/');
    // If empty or new cart, might return { items: [] } or just [] depending on backend
    const items: CartItemResponse[] = Array.isArray(response.data) ? response.data : (response.data.items || []);
    
    // Hydrate cart items with product details
    const hydratedItems = await Promise.all(
      items.map(async (item) => {
        const product = await productApi.getProductById(item.product_id);
        return {
          id: product.id,
          cart_item_id: item.id,
          name: product.title,
          price: product.price,
          quantity: item.quantity,
          image: product.image_url
        };
      })
    );
    return hydratedItems;
  },

  addToCart: async (productId: number, quantity: number = 1) => {
    const response = await axiosInstance.post('/cart/add', {
      product_id: productId,
      quantity
    });
    return response.data;
  },

  updateQuantity: async (cartItemId: number, quantity: number) => {
    const response = await axiosInstance.put(`/cart/update/${cartItemId}?quantity=${quantity}`);
    return response.data;
  },

  removeItem: async (cartItemId: number) => {
    const response = await axiosInstance.delete(`/cart/remove/${cartItemId}`);
    return response.data;
  }
};
