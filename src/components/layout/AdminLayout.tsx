import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-gray-800">
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin" className="block p-2 hover:bg-gray-800 rounded">Dashboard</Link>
          <Link to="/admin/users" className="block p-2 hover:bg-gray-800 rounded">Users</Link>
          <Link to="/admin/categories" className="block p-2 hover:bg-gray-800 rounded">Categories</Link>
          <Link to="/admin/products" className="block p-2 hover:bg-gray-800 rounded">Products</Link>
          <Link to="/admin/orders" className="block p-2 hover:bg-gray-800 rounded">Orders</Link>
          <Link to="/" className="block p-2 text-orange-400 hover:text-orange-300 mt-8">Back to Store</Link>
        </nav>
      </aside>
      
      <main className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
        </header>
        <div className="p-8 flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
      <Toaster position="top-right" />
    </div>
  );
};

export default AdminLayout;
