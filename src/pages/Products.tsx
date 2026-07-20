import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Star, ShoppingCart, Filter, Search, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/api/productApi';
import { categoryApi } from '@/api/categoryApi';
import { formatPrice } from '@/utils/format';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import { getMatchingImage } from '@/utils/imageMatching';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategoryId = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('q') || '';
  const [showFilters, setShowFilters] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const addToCart = useCartStore(state => state.addItem);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getCategories
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', activeCategoryId, searchQuery],
    queryFn: async () => {
      if (searchQuery) return productApi.searchProducts(searchQuery);
      if (activeCategoryId !== 'All') return productApi.getByCategory(activeCategoryId);
      return productApi.getProducts(0, 100);
    }
  });

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryId);
    }
    setSearchParams(searchParams);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch) {
      searchParams.set('q', localSearch);
    } else {
      searchParams.delete('q');
    }
    setSearchParams(searchParams);
  };

  const handleAddToCart = (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    addToCart(productId, 1);
    toast.success('Added to cart!');
  };

  return (
    <div className="bg-gray-100 dark:bg-[#0F172A] min-h-screen">
      
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="bb-container py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-[#FF6B00]">Home</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 dark:text-gray-200 font-medium">Products</span>
          {activeCategoryId !== 'All' && (
            <>
              <ChevronRight size={14} />
              <span className="text-gray-900 dark:text-gray-200 font-medium">Category {activeCategoryId}</span>
            </>
          )}
        </div>
      </div>

      <div className="bb-container flex flex-col md:flex-row gap-8 pb-4 pt-6 h-[calc(100vh-110px)] overflow-hidden">
        
        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex justify-between gap-4 shrink-0">
          <form onSubmit={handleSearch} className="flex-1 flex shadow-sm rounded-lg overflow-hidden">
            <input 
              type="text" 
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search BharatBazaar..." 
              className="w-full border-y border-l border-gray-300 dark:border-gray-600 rounded-l-lg px-4 bg-white dark:bg-gray-800 focus:outline-none"
            />
            <button type="submit" className="bg-[#FF6B00] text-white px-4"><Search size={18} /></button>
          </form>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-300 dark:border-gray-600 font-medium"
          >
            <Filter size={18} /> Filters
          </button>
        </div>

        {/* Sidebar Filters */}
        <aside className={`md:w-64 flex-shrink-0 h-full overflow-hidden ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 h-full overflow-y-auto pb-20 no-scrollbar">
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 font-['Poppins']">Categories</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleCategoryClick('All')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition ${
                    activeCategoryId === 'All' 
                      ? 'bg-orange-50 dark:bg-orange-900/20 text-[#FF6B00] font-bold' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium'
                  }`}
                >
                  All Products
                </button>
              </li>
              {categories?.map(category => (
                <li key={category.id}>
                  <button 
                    onClick={() => handleCategoryClick(category.id.toString())}
                    className={`w-full text-left px-3 py-2 rounded-xl transition ${
                      activeCategoryId === category.id.toString() 
                        ? 'bg-orange-50 dark:bg-orange-900/20 text-[#FF6B00] font-bold' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium'
                    }`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 h-full overflow-y-auto pb-20 pr-2">
          <div className="mb-6 flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 sticky top-0 z-10">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white font-['Poppins']">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
            </h1>
            <span className="text-gray-500 font-medium text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              {products?.length || 0} items
            </span>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-80 bg-white dark:bg-gray-800 rounded-2xl animate-pulse shadow-sm"></div>)}
            </div>
          ) : products?.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 p-16 text-center rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
                <Search size={40} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-['Poppins']">No products found</h2>
              <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
              <button 
                onClick={() => {setSearchParams({}); setLocalSearch('');}}
                className="mt-6 bb-button-primary px-6 py-2.5"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products?.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`} className="bb-card group flex flex-col">
                  <div className="relative h-56 overflow-hidden bg-gray-50 flex items-center justify-center p-4">
                    <img src={getMatchingImage(product)} alt={product.title} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply dark:mix-blend-normal" />
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[11px] font-bold px-2 py-1 rounded-sm shadow-md">
                      {Math.floor(Math.random() * 40 + 10)}% OFF
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 hover:text-[#FF6B00] dark:hover:text-[#FF6B00] line-clamp-2 mb-2 flex-1 leading-snug">
                      {product.title}
                    </h3>
                    <div className="flex items-center mb-3">
                      <Star className="text-[#FF6B00] fill-[#FF6B00]" size={14} />
                      <Star className="text-[#FF6B00] fill-[#FF6B00]" size={14} />
                      <Star className="text-[#FF6B00] fill-[#FF6B00]" size={14} />
                      <Star className="text-[#FF6B00] fill-[#FF6B00]" size={14} />
                      <Star className="text-gray-300 dark:text-gray-600" size={14} />
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium ml-2 hover:underline">
                        {Math.floor(Math.random() * 5000)} ratings
                      </span>
                    </div>
                    <div className="mt-auto flex items-end justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400 line-through mb-0.5">{formatPrice(product.price * 1.2)}</span>
                        <span className="text-xl font-bold text-gray-900 dark:text-white leading-none">{formatPrice(product.price)}</span>
                      </div>
                      {isAuthenticated && (
                        <button 
                          onClick={(e) => handleAddToCart(e, product.id)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm active:scale-95"
                          title="Add to Cart"
                        >
                          <ShoppingCart size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
