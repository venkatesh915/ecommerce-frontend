import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, ArrowLeft, Clock, MapPin, ReceiptText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { orderApi } from '@/api/orderApi';
import { formatPrice } from '@/utils/format';

const STEPS = [
  { key: 'pending', label: 'Ordered', icon: <ReceiptText size={20} /> },
  { key: 'confirmed', label: 'Confirmed', icon: <CheckCircle size={20} /> },
  { key: 'shipped', label: 'Shipped', icon: <Package size={20} /> },
  { key: 'transport', label: 'Out for Delivery', icon: <Truck size={20} /> },
  { key: 'delivered', label: 'Delivered', icon: <CheckCircle size={20} /> }
];

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderApi.getOrderById(id!)
  });

  if (isLoading) {
    return <div className="py-24 text-center dark:text-white">Loading order details...</div>;
  }

  if (!order) {
    return <div className="py-24 text-center dark:text-white">Order not found</div>;
  }

  // Determine current step index based on status
  const currentStatus = order.status.toLowerCase();
  let currentStepIndex = STEPS.findIndex(s => s.key === currentStatus);
  if (currentStepIndex === -1) {
    if (currentStatus === 'payment_completed') currentStepIndex = 1;
    else currentStepIndex = 0;
  }

  // Estimate delivery based on backend date or mock it
  let estimatedDateStr = 'Arriving soon';
  if (order.estimated_delivery_time) {
    estimatedDateStr = `Arriving ${new Date(order.estimated_delivery_time).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}`;
  } else {
    // Mock delivery date: Order date + 3 days
    const mockDate = new Date();
    mockDate.setDate(mockDate.getDate() + 3);
    estimatedDateStr = `Arriving ${mockDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}`;
  }

  if (currentStatus === 'delivered') {
    estimatedDateStr = 'Delivered on time';
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pb-12">
      <div className="max-w-[1000px] mx-auto pt-6 px-4">
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
          <Link to="/profile" className="hover:text-orange-600">Your Account</Link>
          <span>›</span>
          <Link to="/orders" className="hover:text-orange-600">Your Orders</Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-gray-200">Order Details</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order Details</h1>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex flex-wrap gap-x-6 gap-y-2">
          <span>Ordered on {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          <span className="hidden sm:inline">|</span>
          <span>Order# <span className="font-medium text-gray-900 dark:text-gray-200">{order.id}-{Math.random().toString().slice(2, 10)}</span></span>
        </div>

        {/* Tracking Pipeline (Amazon Style) */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 mb-8 overflow-hidden">
          
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className={`text-xl font-bold ${currentStatus === 'delivered' ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                {estimatedDateStr}
              </h2>
              {order.tracking_number && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Tracking ID: <span className="font-medium text-orange-600 dark:text-orange-400">{order.tracking_number}</span>
                </p>
              )}
            </div>
            {currentStatus !== 'delivered' && (
              <button className="px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                Track Package Details
              </button>
            )}
          </div>

          <div className="p-8 overflow-x-auto">
            <div className="min-w-[600px] max-w-[800px] mx-auto py-4 relative">
              {/* Progress Bar Background */}
              <div className="absolute top-1/2 left-[10%] right-[10%] h-1.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 rounded-full z-0"></div>
              
              {/* Active Progress Bar */}
              <div 
                className="absolute top-1/2 left-[10%] h-1.5 bg-green-600 dark:bg-green-500 -translate-y-1/2 rounded-full z-0 transition-all duration-500"
                style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 80}%` }}
              ></div>
              
              <div className="relative z-10 flex justify-between w-full">
                {STEPS.map((step, idx) => {
                  const isActive = idx <= currentStepIndex;
                  return (
                    <div key={step.key} className="flex flex-col items-center gap-3 w-24">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-sm transition-colors duration-300
                        ${isActive ? 'bg-green-600 dark:bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'}`}
                      >
                        {step.icon}
                      </div>
                      <span className={`text-xs font-bold text-center ${isActive ? 'text-green-700 dark:text-green-500' : 'text-gray-500 dark:text-gray-400'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white">Items in this order</h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex gap-4 p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                    <Link to={`/products/${item.product?.id}`} className="w-24 h-24 flex-shrink-0 bg-white border border-gray-200 dark:border-gray-700 rounded-lg p-2 flex items-center justify-center overflow-hidden mix-blend-normal">
                       <img src={item.product?.image_url} alt={item.product?.title} className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                    </Link>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <Link to={`/products/${item.product?.id}`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline hover:text-orange-600 line-clamp-2 mb-1">
                        {item.product?.title}
                      </Link>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Sold by: E-Shop Retail</p>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <p className="font-bold text-gray-900 dark:text-white">{formatPrice(item.price)}</p>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Qty: {item.quantity}</p>
                        </div>
                        <button className="text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-lg transition">
                          Write a product review
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Shipping Address</h3>
              <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <p className="font-medium text-gray-900 dark:text-gray-200 mb-1">User Account</p>
                <p>Address ID: {order.address_id}</p>
                <p>Hyderabad, Telangana</p>
                <p>India</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Payment Method</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 capitalize flex items-center gap-2">
                <span className="w-8 h-5 bg-gray-200 dark:bg-gray-700 rounded text-[10px] font-bold text-gray-600 dark:text-gray-400 flex items-center justify-center uppercase">
                  {order.payment_method === 'cod' ? 'COD' : 'CARD'}
                </span>
                {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Ending in 4321'}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex justify-between"><span>Item(s) Subtotal:</span> <span>{formatPrice(order.total_amount)}</span></div>
                <div className="flex justify-between"><span>Shipping:</span> <span>₹0.00</span></div>
                <div className="flex justify-between"><span>Total:</span> <span>{formatPrice(order.total_amount)}</span></div>
                <div className="flex justify-between text-orange-600 dark:text-orange-400"><span>Dasara Discount:</span> <span>-₹0.00</span></div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between font-bold text-gray-900 dark:text-white text-lg">
                <span>Grand Total:</span> <span>{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;
