import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/adminApi';
import toast from 'react-hot-toast';

const Orders = () => {
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: adminApi.getOrders
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: string }) => adminApi.updateOrderStatus(orderId, status),
    onSuccess: () => {
      toast.success('Order status updated');
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
    },
    onError: () => {
      toast.error('Failed to update order status');
    }
  });

  if (isLoading) return <div className="p-8">Loading orders...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-900">Manage Orders</h1>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b">
              <th className="p-4 font-semibold">Order ID</th>
              <th className="p-4 font-semibold">Customer</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Total</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map(order => (
              <tr key={order.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-orange-600">#ORD-{order.id}</td>
                <td className="p-4 text-gray-900 font-medium">User {order.user_id}</td>
                <td className="p-4 text-gray-500 text-sm">--</td>
                <td className="p-4 font-medium text-gray-900">${(order.total_amount).toFixed(2)}</td>
                <td className="p-4">
                  <select 
                    defaultValue={order.status} 
                    onChange={(e) => updateStatusMutation.mutate({ orderId: order.id, status: e.target.value })}
                    disabled={updateStatusMutation.isPending}
                    className="border rounded px-2 py-1 text-sm bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none capitalize disabled:opacity-50"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="p-4 text-right">
                  <button className="text-orange-600 hover:underline text-sm font-medium">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
