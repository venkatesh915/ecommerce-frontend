import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, Menu, Sun, Moon, ShoppingBag, ChevronDown, Bell, MapPin } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { formatPrice } from '@/utils/format';
import { useThemeStore } from '@/store/themeStore';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const cartItemsCount = useCartStore(state => state.items.reduce((acc, item) => acc + item.quantity, 0));
  const cartTotal = useCartStore(state => state.getTotal());
  const wishlistItemsCount = useWishlistStore(state => state.items.length);
  const { isDark, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <nav className="bg-[#0F172A] text-white sticky top-0 z-50 shadow-md">
      {/* Top Banner (Optional small utility bar) */}
      <div className="bg-orange-600 text-xs text-white py-1.5 font-medium tracking-wider overflow-hidden hidden sm:block">
  <div className="animate-marquee whitespace-nowrap">
    Maha Dasara Sale: Up to 60% Off | HDFC Bank 10% Instant Discount
    <span className="mx-80"></span>
    Maha Dasara Sale: Up to 60% Off | HDFC Bank 10% Instant Discount
  </div>
</div>

      <div className="bb-container py-3">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="bg-[#FF6B00] text-white p-1.5 rounded-lg group-hover:scale-105 transition-transform">
              <ShoppingBag size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold tracking-tight text-white font-['Poppins']">BharatBazaar</span>
              <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase mt-0.5">Marketplace</span>
            </div>
          </Link>

          {/* Delivery Location (Desktop) */}
          <div className="hidden lg:flex items-center gap-1 hover:border border-transparent hover:border-white p-2 rounded cursor-pointer transition flex-shrink-0">
            <MapPin size={20} className="text-gray-300" />
            <div className="flex flex-col leading-tight">
              {isAuthenticated ? (
                <>
                  <span className="text-xs text-gray-400">Deliver to {user?.full_name?.split(' ')[0] || 'User'}</span>
                  <span className="text-sm font-bold text-white">Select Address</span>
                </>
              ) : (
                <>
                  <span className="text-xs text-gray-400">Hello</span>
                  <span className="text-sm font-bold text-white">Sign in to view options</span>
                </>
              )}
            </div>
          </div>

          {/* Search Bar (Desktop/Tablet) */}
          <div className="hidden md:flex flex-1 max-w-3xl">
            <form onSubmit={handleSearch} className="relative w-full flex shadow-sm rounded-lg overflow-hidden border border-gray-600 focus-within:border-orange-500 transition-colors">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands and more..." 
                className="w-full px-4 py-2.5 text-gray-900 bg-white focus:outline-none"
              />
              <button type="submit" className="bg-[#FF6B00] hover:bg-[#E65A00] text-white px-6 py-2.5 transition flex items-center justify-center">
                <Search size={20} />
              </button>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 lg:gap-6 flex-shrink-0">
            
            <button onClick={toggleTheme} className="hover:text-[#FF6B00] transition text-gray-300" aria-label="Toggle Theme">
              {isDark ? <Sun size={22} /> : <Moon size={22} />}
            </button>

            {isAuthenticated ? (
              <div className="group relative">
                <button className="flex flex-col items-start hover:text-[#FF6B00] transition">
                  <span className="text-xs text-gray-400">Hello, {user?.full_name?.split(' ')[0] || 'User'}</span>
                  <span className="text-sm font-bold flex items-center">Account & Lists <ChevronDown size={14} className="ml-1" /></span>
                </button>
                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-64 bg-white text-gray-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                  <div className="p-4 border-b border-gray-100">
                    <p className="font-bold">{user?.full_name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <div className="p-2 flex flex-col">
                    <Link to="/profile" className="px-4 py-2 hover:bg-gray-50 rounded-lg text-sm font-medium">My Profile</Link>
                    <Link to="/orders" className="px-4 py-2 hover:bg-gray-50 rounded-lg text-sm font-medium">My Orders</Link>
                    <Link to="/wishlist" className="px-4 py-2 hover:bg-gray-50 rounded-lg text-sm font-medium">Wishlist</Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="px-4 py-2 hover:bg-orange-50 rounded-lg text-sm text-[#FF6B00] font-bold">Admin Dashboard</Link>
                    )}
                    <div className="h-px bg-gray-100 my-2"></div>
                    <button onClick={logout} className="text-left px-4 py-2 hover:bg-red-50 rounded-lg text-sm font-medium text-red-600 transition">Sign Out</button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex flex-col items-start hover:text-[#FF6B00] transition">
                <span className="text-xs text-gray-400">Hello, sign in</span>
                <span className="text-sm font-bold flex items-center">Account & Lists <ChevronDown size={14} className="ml-1" /></span>
              </Link>
            )}

            {isAuthenticated && (
              <Link to="/orders" className="hidden lg:flex flex-col items-start hover:text-[#FF6B00] transition">
                <span className="text-xs text-gray-400">Returns</span>
                <span className="text-sm font-bold">& Orders</span>
              </Link>
            )}

            <Link to="/cart" className="hover:text-[#FF6B00] transition relative flex items-end gap-1">
              <div className="relative pb-1">
                <ShoppingCart size={28} />
                <span className="absolute -top-1 -right-2 bg-[#FF6B00] text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0F172A]">
                  {cartItemsCount}
                </span>
              </div>
              <span className="hidden lg:inline text-sm font-bold mb-1">Cart</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearch} className="relative w-full flex rounded-lg overflow-hidden">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search BharatBazaar..." 
              className="w-full px-4 py-2.5 text-gray-900 bg-white focus:outline-none"
            />
            <button type="submit" className="bg-[#FF6B00] text-white px-5 flex items-center justify-center">
              <Search size={20} />
            </button>
          </form>
        </div>
      </div>
      
      {/* Secondary Nav */}
      <div className="bg-[#1E293B] text-sm text-gray-200 shadow-inner">
        <div className="bb-container py-2 flex items-center gap-6 overflow-x-auto no-scrollbar whitespace-nowrap">
          <Link to="/products" className="flex items-center gap-1 font-bold hover:text-white transition hover:border-white border border-transparent px-2 py-1 rounded">
            <Menu size={18} /> All
          </Link>
          <Link to="/products?q=fresh" className="hover:text-white transition hover:border-white border border-transparent px-2 py-1 rounded">Fresh</Link>
          <Link to="/products?q=minitv" className="hover:text-white transition hover:border-white border border-transparent px-2 py-1 rounded">BharatBazaar miniTV</Link>
          <Link to="/products?q=sell" className="hover:text-white transition hover:border-white border border-transparent px-2 py-1 rounded">Sell</Link>
          <Link to="/products?q=best" className="hover:text-white transition hover:border-white border border-transparent px-2 py-1 rounded">Best Sellers</Link>
          <Link to="/products?q=deal" className="hover:text-white transition hover:border-white border border-transparent px-2 py-1 rounded">Today's Deals</Link>
          <Link to="/products?category=1" className="hover:text-white transition hover:border-white border border-transparent px-2 py-1 rounded">Mobiles</Link>
          <Link to="/products?q=service" className="hover:text-white transition hover:border-white border border-transparent px-2 py-1 rounded">Customer Service</Link>
          <Link to="/products?q=new" className="hover:text-white transition hover:border-white border border-transparent px-2 py-1 rounded">New Releases</Link>
          
          {/* Ad Banner on right */}
          <div className="ml-auto hidden xl:block">
            <Link to="/products" className="font-bold text-[#FF6B00] hover:text-orange-400">
              Download the App for Exclusive Offers
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
