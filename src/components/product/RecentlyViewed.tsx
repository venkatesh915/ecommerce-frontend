import React from 'react';
import { Link } from 'react-router-dom';
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';
import { Clock, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/utils/format';

const RecentlyViewed = () => {
  const items = useRecentlyViewedStore(state => state.items);

  if (!items || items.length === 0) return null;

  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Clock className="text-[#FF6B00]" size={24} /> 
          Inspired by your browsing history
        </h2>
        <button onClick={() => useRecentlyViewedStore.getState().clearItems()} className="text-sm font-medium text-gray-500 hover:text-red-500 transition">
          Clear history
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {items.map((product) => (
          <Link 
            key={product.id} 
            to={`/products/${product.id}`}
            className="w-48 flex-shrink-0 group relative border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-white dark:bg-gray-800 p-3"
          >
            <div className="aspect-square bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center p-2 mb-3 group-hover:scale-105 transition-transform">
              <img src={product.image_url} alt={product.title} className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
            </div>
            <h3 className="font-medium text-sm text-gray-800 dark:text-gray-200 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
              {product.title}
            </h3>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPrice(product.price)}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;
