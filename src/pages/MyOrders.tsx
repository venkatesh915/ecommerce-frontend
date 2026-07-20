import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { orderApi } from '@/api/orderApi';

const MyOrders = () => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['myOrders'],
    queryFn: orderApi.getOrders
  });

  if (isLoading) {
    return <div className="py-24 text-center">Loading orders...</div>;
  }

  return (
    <div className="py-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {!orders || orders.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No orders found</h2>
          <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
          <Link to="/products" className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-2 rounded-lg transition">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b">
                <div className="flex gap-8">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total</p>
                    <p className="text-sm font-medium text-gray-900">${order.total_amount.toFixed(2)}</p>
                  </div>
                  {order.tracking_number && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Tracking Code</p>
                      <p className="text-sm font-medium text-gray-900">{order.tracking_number}</p>
                    </div>
                  )}
                </div>
                <div className="text-right flex-1 sm:flex-none">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Order #</p>
                  <p className="text-sm font-medium text-orange-600">{order.id}</p>
                </div>
              </div>
              
              <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden p-2">
                    {order.items && order.items.length > 0 && order.items[0].product?.image_url ? (
                      <img src={order.items[0].product.image_url} alt={order.items[0].product.title} className="w-full h-full object-contain mix-blend-multiply" />
                    ) : (
                      <Package className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                      {order.items && order.items.length > 0 ? order.items[0].product?.title : 'Order Items'}
                      {order.items && order.items.length > 1 && ` + ${order.items.length - 1} more`}
                    </h3>
                    
                    <div className="flex items-center gap-2 mt-2">
                      {order.status === 'delivered' ? (
                        <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md capitalize"><CheckCircle2 size={16} className="mr-1" /> {order.status}</span>
                      ) : (
                        <span className="flex items-center text-sm font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-md capitalize"><Clock size={16} className="mr-1" /> {order.status}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-auto">
                  <Link to={`/orders/${order.id}`} className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-lg transition">
                    View Details <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
