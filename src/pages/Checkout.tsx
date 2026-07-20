import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { CreditCard, Truck, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { addressApi } from '@/api/addressApi';
import type { AddressCreate } from '@/api/addressApi';
import { orderApi } from '@/api/orderApi';
import toast from 'react-hot-toast';
import { formatPrice } from '@/utils/format';

const Checkout = () => {
  const { items, getTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  const { data: addresses, refetch: refetchAddresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: addressApi.getAddresses
  });
  
  const subtotal = getTotal();
  const discount = paymentMethod === 'hdfc_card' ? subtotal * 0.10 : 0;
  const tax = (subtotal - discount) * 0.08;
  const finalTotal = subtotal - discount + tax;

  const placeOrderMutation = useMutation({
    mutationFn: (addressId: number) => orderApi.placeOrder(addressId, paymentMethod === 'hdfc_card' ? 'card' : paymentMethod),
    onSuccess: () => {
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/orders');
    },
    onError: () => {
      toast.error('Failed to place order.');
    }
  });

  if (items.length === 0 && step === 1) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      toast.error('Please select an address');
      return;
    }
    placeOrderMutation.mutate(selectedAddressId);
  };

  return (
    <div className="py-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-orange-600 -z-10 transition-all duration-300" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
        
        {[
          { num: 1, label: 'Shipping', icon: <Truck size={20} /> },
          { num: 2, label: 'Payment', icon: <CreditCard size={20} /> },
          { num: 3, label: 'Review', icon: <CheckCircle size={20} /> },
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center bg-gray-50 px-2">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition-colors border-4 ${step >= s.num ? 'bg-orange-600 text-white border-orange-100' : 'bg-gray-200 text-gray-500 border-white'}`}>
              {s.icon}
            </div>
            <span className={`text-sm font-medium ${step >= s.num ? 'text-orange-600' : 'text-gray-500'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6">Select Shipping Address</h2>
              
              {addresses && addresses.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {addresses.map((address) => (
                    <label key={address.id} className={`block border rounded-xl p-4 cursor-pointer transition ${selectedAddressId === address.id ? 'border-orange-600 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}>
                      <div className="flex items-start gap-3">
                        <input 
                          type="radio" 
                          name="address" 
                          checked={selectedAddressId === address.id}
                          onChange={() => setSelectedAddressId(address.id)}
                          className="mt-1 w-4 h-4 text-orange-600" 
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{address.full_name}</p>
                          <p className="text-sm text-gray-600">{address.address}, {address.city}</p>
                          <p className="text-sm text-gray-600">{address.state} - {address.pincode}</p>
                          <p className="text-sm text-gray-600">Phone: {address.phone}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg mb-6">
                  No addresses found. You need to add an address in your profile first. (Mock address will be used if none selected)
                </div>
              )}

              <div className="pt-6">
                <button 
                  type="button" 
                  onClick={() => {
                    if (!selectedAddressId) {
                      toast.error('Please select an address');
                      return;
                    }
                    setStep(2);
                  }} 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition"
                >
                  Continue to Payment <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6">Payment Method</h2>
              <div className="space-y-4">
                <label className={`block border rounded-xl p-4 cursor-pointer transition ${paymentMethod === 'card' ? 'border-orange-600 bg-orange-50' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-4 h-4 text-orange-600" />
                      <span className="font-semibold text-gray-900">Credit / Debit Card (Standard)</span>
                    </div>
                    <CreditCard className={paymentMethod === 'card' ? 'text-orange-600' : 'text-gray-400'} />
                  </div>
                </label>
                
                <label className={`block border-2 border-orange-400 rounded-xl p-4 cursor-pointer transition shadow-sm ${paymentMethod === 'hdfc_card' ? 'bg-orange-50' : 'bg-gradient-to-r from-orange-50 to-white'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" checked={paymentMethod === 'hdfc_card'} onChange={() => setPaymentMethod('hdfc_card')} className="w-4 h-4 text-orange-600" />
                      <div>
                        <span className="font-bold text-orange-800">HDFC Credit Card</span>
                        <span className="block text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full inline-block mt-1">10% Instant Discount!</span>
                      </div>
                    </div>
                    <CreditCard className="text-orange-600" />
                  </div>
                </label>
                
                <label className={`block border rounded-xl p-4 cursor-pointer transition ${paymentMethod === 'cod' ? 'border-orange-600 bg-orange-50' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-4 h-4 text-orange-600" />
                      <span className="font-semibold text-gray-900">Cash on Delivery</span>
                    </div>
                    <Truck className={paymentMethod === 'cod' ? 'text-orange-600' : 'text-gray-400'} />
                  </div>
                </label>
              </div>

              {(paymentMethod === 'card' || paymentMethod === 'hdfc_card') && (
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input type="text" className="w-full border rounded-lg px-4 py-2" placeholder="0000 0000 0000 0000" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input type="text" className="w-full border rounded-lg px-4 py-2" placeholder="MM/YY" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input type="text" className="w-full border rounded-lg px-4 py-2" placeholder="123" />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setStep(1)} className="flex-1 bg-gray-100 text-gray-800 font-bold py-3 rounded-xl flex justify-center items-center gap-2">
                  <ChevronLeft size={20} /> Back
                </button>
                <button type="button" onClick={() => setStep(3)} className="flex-1 bg-orange-600 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2">
                  Review Order <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6">Review Order</h2>
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Shipping Address</h3>
                  {selectedAddressId && addresses ? (
                    (() => {
                      const addr = addresses.find(a => a.id === selectedAddressId);
                      return addr ? (
                        <p className="text-gray-600 text-sm">
                          {addr.full_name}<br/>{addr.address}<br/>{addr.city}, {addr.state} {addr.pincode}
                        </p>
                      ) : <p className="text-gray-600 text-sm">No address selected</p>;
                    })()
                  ) : (
                     <p className="text-gray-600 text-sm">No address selected</p>
                  )}
                </div>
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Payment Method</h3>
                  <p className="text-gray-600 text-sm">
                    {paymentMethod === 'card' ? 'Credit / Debit Card' : paymentMethod === 'hdfc_card' ? 'HDFC Credit Card (10% Discount)' : 'Cash on Delivery'}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">Items ({items.length})</h3>
                  <div className="space-y-4">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1">
                          <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                          <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-sm">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="pt-8 flex gap-4">
                <button type="button" onClick={() => setStep(2)} disabled={placeOrderMutation.isPending} className="flex-1 bg-gray-100 text-gray-800 font-bold py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-gray-200 transition">
                  <ChevronLeft size={20} /> Back
                </button>
                <button type="button" onClick={handlePlaceOrder} disabled={placeOrderMutation.isPending} className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 shadow-lg shadow-green-200 hover:bg-green-700 transition">
                  {placeOrderMutation.isPending ? 'Placing Order...' : 'Place Order'} <CheckCircle size={20} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-96">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Items ({items.reduce((acc, i) => acc + i.quantity, 0)}):</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping:</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-orange-600 font-semibold">
                  <span>HDFC 10% Discount:</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Estimated Tax:</span>
                <span>{formatPrice(tax)}</span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Order Total:</span>
                <span className="text-red-600">{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
