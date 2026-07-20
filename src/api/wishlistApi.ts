import { axiosInstance } from './axios';
import { productApi } from './productApi';
import type { HydratedCartItem } from './cartApi';

export interface WishlistItemResponse {
  id: number;
  wishlist_id: number;
  product_id: number;
}

export const wishlistApi = {
  getWishlist: async (): Promise<HydratedCartItem[]> => {
    const response = await axiosInstance.get('/wishlist/');
    const items: WishlistItemResponse[] = Array.isArray(response.data) ? response.data : (response.data.items || []);
    
    // Hydrate
    const hydratedItems = await Promise.all(
      items.map(async (item) => {
        const product = await productApi.getProductById(item.product_id);
        return {
          id: product.id,
          cart_item_id: item.id, // using this for wishlist_item_id
          name: product.title,
          price: product.price,
          quantity: 1,
          image: product.image_url
        };
      })
    );
    return hydratedItems;
  },

  addToWishlist: async (productId: number) => {
    const response = await axiosInstance.post('/wishlist/', { product_id: productId });
    return response.data;
  },

  removeWishlist: async (wishlistItemId: number) => {
    const response = await axiosInstance.delete(`/wishlist/${wishlistItemId}`);
    return response.data;
  }
};
