import React from 'react';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/api/adminApi';

const Dashboard = () => {
  const { data: sales, isLoading: isLoadingSales } = useQuery({
    queryKey: ['adminSales'],
    queryFn: adminApi.getSalesSummary
  });

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: adminApi.getUsers
  });

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: adminApi.getProducts
  });

  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: adminApi.getOrders
  });

  const stats = [
    { label: 'Total Revenue', value: `$${(sales?.total_revenue || 0).toFixed(2)}`, change: '+20.1%', icon: <DollarSign size={24} className="text-orange-600" />, trend: 'up' },
    { label: 'Total Orders', value: sales?.total_orders || 0, change: '+15.2%', icon: <ShoppingCart size={24} className="text-green-600" />, trend: 'up' },
    { label: 'Total Products', value: products?.length || 0, change: '-2.4%', icon: <Package size={24} className="text-orange-600" />, trend: 'down' },
    { label: 'Active Users', value: users?.length || 0, change: '+10.5%', icon: <Users size={24} className="text-purple-600" />, trend: 'up' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className={`text-sm mt-2 flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend === 'up' ? <TrendingUp size={14} /> : <TrendingUp size={14} className="transform rotate-180" />}
                {stat.change} from last month
              </p>
            </div>
            <div className="p-4 rounded-full bg-gray-50">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Analytics</h2>
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            Chart Placeholder (Use Recharts or Chart.js)
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {orders?.slice(0, 5).map((order) => (
              <div key={order.id} className="flex justify-between items-center pb-4 border-b last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-semibold text-gray-900">#ORD-{order.id}</p>
                  <p className="text-xs text-gray-500">User ID: {order.user_id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">${(order.total_amount).toFixed(2)}</p>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium capitalize">{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
