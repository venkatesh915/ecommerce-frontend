import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, ChevronRight, ChevronLeft, Zap, ShieldCheck, Truck, Clock, RefreshCw, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/api/productApi';
import { categoryApi } from '@/api/categoryApi';
import { formatPrice } from '@/utils/format';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import { getMatchingImage } from '@/utils/imageMatching';
import RecentlyViewed from '@/components/product/RecentlyViewed';

const banners = [
  {
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1440&q=80",
    title: "Electronics Mega Sale",
    subtitle: "Up to 60% off on Laptops, Mobiles & more.",
    link: "/products?category=12"
  },
  {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1440&q=80",
    title: "Fashion Festival",
    subtitle: "Upgrade your wardrobe with top brands.",
    link: "/products?category=5"
  },
  {
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1440&q=80",
    title: "Grocery Savings",
    subtitle: "Fresh daily essentials delivered to your door.",
    link: "/products?category=6"
  },
  {
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1440&q=80",
    title: "Home & Kitchen Deals",
    subtitle: "Revamp your living space today.",
    link: "/products?category=12"
  },
  {
    image: "https://images.unsplash.com/photo-1515688594390-b649af70d282?w=1440&q=80",
    title: "Monsoon Specials",
    subtitle: "Stay cozy with our handpicked selections.",
    link: "/products"
  }
];

const Home = () => {
  const { data: allProducts, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['allProducts'],
    queryFn: () => productApi.getProducts(0, 100)
  });
  
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getCategories
  });

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const addToCart = useCartStore(state => state.addItem);

  const [currentBanner, setCurrentBanner] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20601); // 05:43:21 in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 20601; // restart countdown
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `Ends in ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNextBanner = () => setCurrentBanner((prev) => (prev + 1) % banners.length);
  const handlePrevBanner = () => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);

  const handleAddToCart = (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(productId, 1);
    toast.success('Added to cart!');
  };

  // Section data slices
  const flashSaleProducts = allProducts?.slice(0, 6) || [];
  const trendingProducts = allProducts?.slice(6, 14) || [];
  const dealsOfTheDay = allProducts?.slice(14, 20) || [];
  const featuredProducts = allProducts?.slice(20, 24) || [];
  const newArrivals = allProducts?.slice(24, 30) || [];
  const topRated = allProducts?.slice(30, 34) || [];
  const recentlyViewed = allProducts?.slice(34, 40) || [];
  const recommendedForYou = allProducts?.slice(40, 48) || [];

  const ProductCard = ({ product }: { product: any }) => (
    <Link to={`/products/${product.id}`} className="bb-card group flex flex-col min-w-[200px] sm:min-w-0">
      <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-50 flex items-center justify-center p-4">
        <img src={getMatchingImage(product)} alt={product.title} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply dark:mix-blend-normal" />
        <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-md">
          {Math.floor(Math.random() * 40 + 10)}% OFF
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 hover:text-[#FF6B00] dark:hover:text-[#FF6B00] line-clamp-2 mb-2 flex-1 leading-snug">
          {product.title}
        </h3>
        <div className="flex items-center mb-3">
          <Star className="text-[#FF6B00] fill-[#FF6B00]" size={14} />
          <Star className="text-[#FF6B00] fill-[#FF6B00]" size={14} />
          <Star className="text-[#FF6B00] fill-[#FF6B00]" size={14} />
          <Star className="text-[#FF6B00] fill-[#FF6B00]" size={14} />
          <Star className="text-[#FF6B00] fill-[#FF6B00]" size={14} />
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium ml-2 hover:underline">
            {Math.floor(Math.random() * 5000)}
          </span>
        </div>
        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-400 line-through mb-0.5">{formatPrice(product.price * 1.2)}</span>
            <span className="text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-none">{formatPrice(product.price)}</span>
          </div>
          {isAuthenticated && (
            <button 
              onClick={(e) => handleAddToCart(e, product.id)}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm active:scale-95 z-10" 
              title="Add to Cart"
            >
              <ShoppingCart size={18} />
            </button>
          )}
        </div>
      </div>
    </Link>
  );

  return (
    <div className="bg-gray-100 dark:bg-[#0F172A]">
      
      {/* Hero Carousel */}
      <div className="bb-container pt-4 pb-8">
        <div className="relative rounded-2xl overflow-hidden shadow-xl group h-[300px] md:h-[450px]">
          {banners.map((banner, idx) => (
            <div 
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center">
                <div className="px-8 md:px-16 max-w-2xl">
                  <div className="inline-block bg-red-600 text-white font-bold px-3 py-1 text-sm rounded mb-4">
                    Mega Blockbuster Sale
                  </div>
                  <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg font-['Poppins']">
                    {banner.title}
                  </h1>
                  <p className="text-gray-200 text-sm md:text-lg mb-8 font-medium">
                    {banner.subtitle} Bank offers applied.
                  </p>
                  <Link to={banner.link} className="bg-[#FF6B00] hover:bg-[#E65A00] text-white font-bold px-8 py-3.5 rounded-lg text-lg transition-transform hover:scale-105 inline-block">
                    Explore Deals
                  </Link>
                </div>
              </div>
            </div>
          ))}
          
          <button onClick={handlePrevBanner} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/90 text-gray-800 p-2 rounded-full backdrop-blur-sm z-20 opacity-0 group-hover:opacity-100 transition-all">
            <ChevronLeft size={24} />
          </button>
          <button onClick={handleNextBanner} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/90 text-gray-800 p-2 rounded-full backdrop-blur-sm z-20 opacity-0 group-hover:opacity-100 transition-all">
            <ChevronRight size={24} />
          </button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {banners.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentBanner(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentBanner ? 'bg-[#FF6B00] w-6' : 'bg-white/50 hover:bg-white'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
        <div className="bb-container py-6">
          <div className="flex justify-between items-center overflow-x-auto no-scrollbar gap-8 text-gray-700 dark:text-gray-300 whitespace-nowrap">
            <div className="flex items-center gap-3"><ShieldCheck className="text-[#FF6B00]" size={28} /><span className="font-medium text-sm md:text-base">100% Secure Payments</span></div>
            <div className="flex items-center gap-3"><Truck className="text-[#FF6B00]" size={28} /><span className="font-medium text-sm md:text-base">Free Delivery on First Order</span></div>
            <div className="flex items-center gap-3"><RefreshCw className="text-[#FF6B00]" size={28} /><span className="font-medium text-sm md:text-base">Easy Returns & Refunds</span></div>
            <div className="flex items-center gap-3"><Star className="text-[#FF6B00]" size={28} /><span className="font-medium text-sm md:text-base">Top Rated Products</span></div>
          </div>
        </div>
      </div>

      <div className="bb-container space-y-12 pb-12 pt-6">
        
        {/* Popular Categories */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-['Poppins']">Popular Categories</h2>
            <Link to="/products" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">See all</Link>
          </div>
          {isLoadingCategories ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="aspect-square bg-white dark:bg-gray-800 rounded-2xl animate-pulse"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories?.slice(0, 8).map((category) => (
                <Link key={category.id} to={`/products?category=${category.id}`} className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl h-[280px] bg-slate-900 block transition-all duration-300">
                  <div className="absolute inset-0">
                    <img 
                      src={category.image_url} 
                      alt={category.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out opacity-80 group-hover:opacity-100 mix-blend-overlay md:mix-blend-normal bg-white" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                  </div>
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <h3 className="text-2xl font-bold text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{category.name}</h3>
                    <p className="text-orange-400 font-medium text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                      Explore Category <ArrowRight size={16} className="inline ml-1" />
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Flash Sale */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF6B00] to-yellow-400"></div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-2 rounded-lg animate-pulse">
                <Zap size={24} fill="currentColor" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-4 font-['Poppins']">
                Flash Sale
                <span className="text-sm font-bold bg-red-600 text-white px-2 py-1 rounded hidden sm:inline-block">{formatTime(timeLeft)}</span>
              </h2>
            </div>
            <Link to="/products?q=sale" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">View all <ArrowRight size={16} /></Link>
          </div>
          
          <div className="flex overflow-x-auto gap-4 md:gap-6 pb-4 no-scrollbar -mx-2 px-2">
            {flashSaleProducts.map((product) => (
              <div key={product.id} className="w-[200px] sm:w-[240px] flex-shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

        {/* Trending & Featured Split Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-['Poppins']">Trending Products</h2>
              <Link to="/products?q=trending" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">See all</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {trendingProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
          
          <div className="space-y-6 bg-orange-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-orange-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-['Poppins'] flex items-center gap-2">
              <Star className="text-yellow-500 fill-yellow-500" /> Top Rated
            </h2>
            <div className="space-y-4">
              {topRated.map(product => (
                <Link key={product.id} to={`/products/${product.id}`} className="flex gap-4 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm hover:shadow-md transition">
                  <div className="w-24 h-24 bg-gray-50 flex-shrink-0 rounded-lg overflow-hidden flex items-center justify-center p-2">
                    <img src={getMatchingImage(product)} alt="" className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 hover:text-[#FF6B00] mb-1">{product.title}</h3>
                    <div className="flex items-center mb-1">
                      <Star className="text-yellow-400 fill-yellow-400" size={12} />
                      <span className="text-xs font-bold ml-1 text-gray-600 dark:text-gray-400">4.9</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
            <Link to="/products?q=top" className="block text-center w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white font-semibold py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition">View All Top Rated</Link>
          </div>
        </div>

        {/* Deals of the Day Banner */}
        <section className="bg-[#1E293B] text-white rounded-2xl overflow-hidden shadow-lg relative flex flex-col md:flex-row items-center">
          <div className="p-10 md:p-16 md:w-1/2 z-10">
            <span className="bg-red-500 text-white font-bold px-3 py-1 rounded-full text-xs mb-4 inline-block tracking-wider uppercase">Ends Tonight</span>
            <h2 className="text-3xl md:text-4xl font-black mb-4 font-['Poppins']">Deals of the Day</h2>
            <p className="text-gray-300 mb-8 text-lg">Grab the most anticipated products at unbelievable prices. Hurry up before stocks run out!</p>
            <Link to="/products?q=deal" className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-8 py-3.5 rounded-lg text-lg transition inline-block">
              Shop Now
            </Link>
          </div>
          <div className="md:w-1/2 p-6 z-10 w-full flex overflow-x-auto gap-4 no-scrollbar">
            {dealsOfTheDay.slice(0, 3).map((product) => (
              <div key={product.id} className="w-[180px] flex-shrink-0 bg-white rounded-xl p-3 shadow-2xl transform hover:-translate-y-2 transition duration-300">
                <img src={getMatchingImage(product)} alt="" className="h-32 w-full object-contain mix-blend-multiply mb-3" />
                <h3 className="text-xs font-bold text-gray-900 line-clamp-2 mb-1">{product.title}</h3>
                <span className="text-sm font-black text-[#FF6B00]">{formatPrice(product.price)}</span>
              </div>
            ))}
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-600/20 to-transparent z-0"></div>
        </section>

        {/* Recommended For You Grid */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-['Poppins']">Recommended For You</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {recommendedForYou.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Top Brands static banner */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8 font-['Poppins']">Top Brands on BharatBazaar</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {['Samsung', 'Apple', 'Sony', 'LG', 'Dell', 'HP', 'Nike', 'Adidas'].map(brand => (
              <Link key={brand} to={`/products?q=${brand}`} className="text-2xl md:text-3xl font-black text-gray-500 dark:text-gray-400 hover:text-[#FF6B00] transition cursor-pointer">{brand}</Link>
            ))}
          </div>
        </section>

        <div className="mt-8">
          <RecentlyViewed />
        </div>

      </div>
    </div>
  );
};

export default Home;
