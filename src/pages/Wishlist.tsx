import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { items, removeItem, isLoading } = useWishlistStore();
  const addToCart = useCartStore(state => state.addItem);

  const handleMoveToCart = async (productId: number, wishlistItemId: number) => {
    try {
      await addToCart(productId, 1);
      await removeItem(wishlistItemId);
      toast.success('Moved to cart!');
    } catch (e) {
      toast.error('Failed to move to cart');
    }
  };

  const handleRemove = async (wishlistItemId: number) => {
    try {
      await removeItem(wishlistItemId);
      toast.success('Removed from wishlist');
    } catch (e) {
      toast.error('Failed to remove');
    }
  };

  if (isLoading) return <div className="py-24 text-center">Loading...</div>;

  if (items.length === 0) {
    return (
      <div className="py-24 text-center max-w-lg mx-auto">
        <Heart size={64} className="mx-auto text-gray-300 mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-8 text-lg">Save items you love to your wishlist to review them later.</p>
        <Link to="/products" className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-4 rounded-xl transition inline-block">
          Discover Products
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist ({items.length})</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.cart_item_id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group">
            <Link to={`/products/${item.id}`} className="relative h-56 bg-gray-50 p-4 flex justify-center items-center">
              <img src={item.image} alt={item.name} className="max-w-full max-h-full mix-blend-multiply group-hover:scale-105 transition duration-300" />
            </Link>
            
            <div className="p-5 flex flex-col flex-1">
              <Link to={`/products/${item.id}`} className="font-semibold text-gray-900 hover:text-orange-600 line-clamp-2 mb-2">
                {item.name}
              </Link>
              <span className="text-xl font-bold text-gray-900 mb-6">${Number(item.price).toFixed(2)}</span>
              
              <div className="mt-auto flex gap-2">
                <button 
                  onClick={() => handleMoveToCart(item.id, item.cart_item_id)}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-lg flex justify-center items-center gap-2 font-medium transition"
                >
                  <ShoppingCart size={18} /> Move to Cart
                </button>
                <button 
                  onClick={() => handleRemove(item.cart_item_id)}
                  className="w-12 flex justify-center items-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
