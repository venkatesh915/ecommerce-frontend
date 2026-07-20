import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import { ProtectedRoute, AdminRoute } from './ProtectedRoutes';

// Public Pages
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Products from '@/pages/Products';
import ProductDetails from '@/pages/ProductDetails';
import CustomerService from '@/pages/CustomerService';
import StaticPage from '@/pages/StaticPage';

// Protected Pages (User)
import Cart from '@/pages/Cart';
import Wishlist from '@/pages/Wishlist';
import Profile from '@/pages/Profile';
import Checkout from '@/pages/Checkout';
import MyOrders from '@/pages/MyOrders';
import OrderDetails from '@/pages/OrderDetails';

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminUsers from '@/pages/admin/Users';
import AdminCategories from '@/pages/admin/Categories';
import AdminProducts from '@/pages/admin/Products';
import AdminOrders from '@/pages/admin/Orders';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'products', element: <Products /> },
      { path: 'products/:id', element: <ProductDetails /> },
      { path: 'customer-service', element: <CustomerService /> },
      { path: 'page/:id', element: <StaticPage /> },
      
      // Protected User Routes
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'profile', element: <Profile /> },
          { path: 'cart', element: <Cart /> },
          { path: 'wishlist', element: <Wishlist /> },
          { path: 'checkout', element: <Checkout /> },
          { path: 'orders', element: <MyOrders /> },
          { path: 'orders/:id', element: <OrderDetails /> },
        ]
      }
    ]
  },
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'users', element: <AdminUsers /> },
          { path: 'categories', element: <AdminCategories /> },
          { path: 'products', element: <AdminProducts /> },
          { path: 'orders', element: <AdminOrders /> },
        ]
      }
    ]
  }
]);
