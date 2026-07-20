import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ChevronRight, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import { formatPrice } from '@/utils/format';

const Cart = () => {
  const { items, updateQuantity, removeItem, getTotal, isLoading } = useCartStore();

  const handleUpdateQuantity = async (id: number, currentQuantity: number, change: number) => {
    const newQuantity = Math.max(0, currentQuantity + change);
    try {
      await updateQuantity(id, newQuantity);
    } catch (e) {
      toast.error('Failed to update cart');
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await removeItem(id);
      toast.success('Item removed');
    } catch (e) {
      toast.error('Failed to remove item');
    }
  };

  if (isLoading) {
    return <div className="py-24 text-center">Loading cart...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="py-24 text-center max-w-lg mx-auto">
        <ShoppingCart size={64} className="mx-auto text-gray-300 mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-lg">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-4 rounded-xl transition inline-block">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart ({items.length})</h1>
        
        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.cart_item_id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6">
              <Link to={`/products/${item.id}`} className="w-full sm:w-32 h-32 bg-gray-50 rounded-xl p-2 flex items-center justify-center flex-shrink-0">
                <img src={item.image} alt={item.name} className="max-w-full max-h-full mix-blend-multiply" />
              </Link>
              
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <Link to={`/products/${item.id}`} className="text-lg font-bold text-gray-900 hover:text-orange-600 line-clamp-2">
                    {item.name}
                  </Link>
                  <span className="text-xl font-bold text-gray-900 ml-4">{formatPrice(item.price * item.quantity)}</span>
                </div>
                
                <p className="text-gray-500 text-sm mb-4">{formatPrice(item.price)} each</p>
                
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center border rounded-lg bg-gray-50">
                    <button 
                      onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity, -1)}
                      className="p-2 hover:bg-gray-200 text-gray-600 transition rounded-l-lg"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity, 1)}
                      className="p-2 hover:bg-gray-200 text-gray-600 transition rounded-r-lg"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => handleRemove(item.cart_item_id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition flex items-center gap-2 text-sm font-medium"
                  >
                    <Trash2 size={16} /> <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-[400px]">
        <div className="bg-gray-900 text-white p-8 rounded-2xl sticky top-24 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-8 text-gray-300">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-white">{formatPrice(getTotal())}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-400 font-medium">Free</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span className="font-medium text-white">{formatPrice(getTotal() * 0.08)}</span>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-6 mb-8">
            <div className="flex justify-between items-end">
              <span className="text-lg">Total</span>
              <span className="text-3xl font-black">{formatPrice(getTotal() * 1.08)}</span>
            </div>
          </div>
          
          <Link to="/checkout" className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-orange-900/50">
            Proceed to Checkout <ChevronRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
