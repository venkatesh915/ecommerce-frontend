import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Truck, Shield, ArrowLeft, MapPin, Tag, RefreshCcw, Award, Info, Package, Battery, Zap, CheckCircle2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/api/productApi';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';
import toast from 'react-hot-toast';
import { formatPrice } from '@/utils/format';
import ProductReviews from '@/components/ProductReviews';
import { getMatchingImage } from '@/utils/imageMatching';
import RecentlyViewed from '@/components/product/RecentlyViewed';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>('');
  
  const addToCart = useCartStore(state => state.addItem);
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();
  const { isAuthenticated, user } = useAuthStore();
  const addRecentlyViewed = useRecentlyViewedStore(state => state.addItem);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const data = await productApi.getProductById(id!);
      if (data.image_url && !activeImage) {
        setActiveImage(data.images && data.images.length > 0 ? data.images[0] : getMatchingImage(data));
      }
      
      // Save to recently viewed
      addRecentlyViewed(data);
      
      return data;
    }
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ['relatedProducts', product?.category_id],
    queryFn: () => productApi.getByCategory(product!.category_id.toString()),
    enabled: !!product?.category_id
  });

  if (isLoading) {
    return (
      <div className="py-8 animate-pulse flex flex-col md:flex-row gap-8 bb-container">
        <div className="w-full md:w-5/12 h-[500px] bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
        <div className="w-full md:w-7/12 space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 w-3/4 rounded"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-800 w-1/4 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 w-full rounded mt-8"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 w-full rounded"></div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Product not found</h2>
        <Link to="/products" className="text-[#FF6B00] hover:underline mt-4 inline-block">Back to Products</Link>
      </div>
    );
  }

  const inWishlist = wishlistItems.some(i => i.id === product.id);
  const displayImages = product.images && product.images.length > 0 ? product.images : [getMatchingImage(product)];
  const currentImage = activeImage || displayImages[0];

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    addToCart(product.id, quantity);
    navigate('/checkout');
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product.id);
      toast.success('Added to wishlist');
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-16">
      
      {/* Breadcrumbs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="bb-container py-3 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <Link to="/" className="hover:text-[#FF6B00]">Home</Link>
          <span>›</span>
          <Link to={`/products?category=${product.category_id}`} className="hover:text-[#FF6B00]">Category {product.category_id}</Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-gray-200 font-medium truncate max-w-xs">{product.brand}</span>
        </div>
      </div>

      <div className="bb-container py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT: Image Gallery */}
          <div className="w-full lg:w-4/12 flex flex-col md:flex-row gap-4 h-full lg:sticky lg:top-24">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-y-auto no-scrollbar pb-2 md:pb-0">
              {displayImages.map((img, idx) => (
                <button 
                  key={idx}
                  onMouseEnter={() => setActiveImage(img)}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-xl border-2 overflow-hidden flex items-center justify-center p-1 transition-all bg-white dark:bg-gray-800 ${currentImage === img ? 'border-[#FF6B00] shadow-md scale-105' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 order-1 md:order-2 bg-white dark:bg-gray-800 rounded-2xl p-4 flex items-center justify-center min-h-[400px] md:min-h-[500px] shadow-sm border border-gray-100 dark:border-gray-700 relative group overflow-hidden">
              <img 
                src={currentImage} 
                alt={product.title} 
                className="max-w-full max-h-[450px] object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 cursor-crosshair hover:scale-150 origin-center" 
                onMouseMove={(e) => {
                  const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - left) / width) * 100;
                  const y = ((e.clientY - top) / height) * 100;
                  e.currentTarget.style.transformOrigin = `${x}% ${y}%`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transformOrigin = 'center center';
                }}
              />
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  const currentIndex = displayImages.indexOf(currentImage);
                  const prevIndex = currentIndex === 0 ? displayImages.length - 1 : currentIndex - 1;
                  setActiveImage(displayImages[prevIndex]);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow hover:bg-white transition opacity-0 group-hover:opacity-100 border border-gray-200 dark:border-gray-600"
              >
                <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  const currentIndex = displayImages.indexOf(currentImage);
                  const nextIndex = currentIndex === displayImages.length - 1 ? 0 : currentIndex + 1;
                  setActiveImage(displayImages[nextIndex]);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow hover:bg-white transition opacity-0 group-hover:opacity-100 border border-gray-200 dark:border-gray-600 transform rotate-180"
              >
                <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
              </button>
              
              <button 
                onClick={handleWishlistToggle}
                className={`absolute top-4 right-4 p-3 rounded-full shadow-md bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 transition-all hover:scale-110 ${inWishlist ? 'text-red-500' : 'text-gray-400'}`}
              >
                <Heart size={24} className={inWishlist ? 'fill-red-500' : ''} />
              </button>
            </div>
          </div>

          {/* MIDDLE: Product Details */}
          <div className="w-full lg:w-5/12 flex flex-col gap-6">
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <Link to={`/products?q=${product.brand}`} className="text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline uppercase tracking-wider mb-2 inline-block">
                Visit the {product.brand} Store
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-snug font-['Poppins']">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-4 mt-3 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center">
                  <Star className="text-yellow-400 fill-yellow-400" size={18} />
                  <Star className="text-yellow-400 fill-yellow-400" size={18} />
                  <Star className="text-yellow-400 fill-yellow-400" size={18} />
                  <Star className="text-yellow-400 fill-yellow-400" size={18} />
                  <Star className="text-yellow-400 fill-yellow-400" size={18} />
                  <span className="text-blue-600 dark:text-blue-400 ml-2 hover:underline cursor-pointer font-medium text-sm">3,492 Ratings</span>
                </div>
              </div>

              {/* Price & Offers */}
              <div className="mt-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-start text-red-600 dark:text-red-400 mb-2">
                  <span className="text-2xl font-light mt-1">-15%</span>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white ml-3 flex items-center">
                    <span className="text-2xl font-medium mr-1">₹</span>
                    {product.price.toLocaleString('en-IN')}
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">M.R.P.: <span className="line-through">₹{(product.price * 1.15).toLocaleString('en-IN')}</span> (Inclusive of all taxes)</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-3 flex items-center gap-2">
                  <CreditCard className="text-[#FF6B00]" size={16} /> <span className="font-bold">EMI</span> starts at ₹{Math.round(product.price / 12)}. No Cost EMI available.
                </p>
              </div>

              {/* Offers Grid */}
              <div className="mt-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Tag size={18} className="text-[#FF6B00]" /> Available Offers</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="border border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-900/10 p-3 rounded-xl shadow-sm">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">Bank Offer</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">10% Instant Discount on HDFC Bank Credit Cards.</p>
                  </div>
                  <div className="border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/10 p-3 rounded-xl shadow-sm">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">Partner Offer</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Get GST invoice and save up to 28% on business purchases.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Key Features & Highlights */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 font-['Poppins'] border-b border-gray-100 dark:border-gray-700 pb-2">Key Highlights</h3>
              <ul className="space-y-3">
                <li className="flex gap-2 text-sm text-gray-700 dark:text-gray-300"><CheckCircle2 className="text-green-500 flex-shrink-0" size={18} /> Premium built quality ensuring high durability.</li>
                <li className="flex gap-2 text-sm text-gray-700 dark:text-gray-300"><CheckCircle2 className="text-green-500 flex-shrink-0" size={18} /> Designed with cutting-edge technology by {product.brand}.</li>
                <li className="flex gap-2 text-sm text-gray-700 dark:text-gray-300"><CheckCircle2 className="text-green-500 flex-shrink-0" size={18} /> Validated for standard safety norms.</li>
                <li className="flex gap-2 text-sm text-gray-700 dark:text-gray-300"><CheckCircle2 className="text-green-500 flex-shrink-0" size={18} /> Compact and elegant design suitable for all environments.</li>
              </ul>
            </div>

            {/* Trust Markers */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between text-center gap-2">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 mb-2"><RefreshCcw size={24} /></div>
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">7 Days<br/>Replacement</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-600 mb-2"><Truck size={24} /></div>
                  <span className="text-xs font-medium text-orange-600 dark:text-orange-400">Free<br/>Delivery</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 mb-2"><Shield size={24} /></div>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">1 Year<br/>Warranty</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 mb-2"><Award size={24} /></div>
                  <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Top<br/>Brand</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: Buy Box & Seller Info */}
          <div className="w-full lg:w-3/12 flex flex-col gap-6">
            
            {/* Action Box */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md sticky top-24">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                ₹{product.price.toLocaleString('en-IN')}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                FREE delivery <span className="font-bold">Wednesday, {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).getDate()} October</span>.
              </p>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6 font-medium">
                <MapPin size={16} className="text-[#FF6B00]" /> 
                <span className="hover:text-blue-600 cursor-pointer text-blue-600 dark:text-blue-400">
                  {isAuthenticated ? `Deliver to ${user?.full_name?.split(' ')[0] || 'User'} - Select Address` : 'Sign in to view delivery options'}
                </span>
              </div>
              
              {product.stock > 0 ? (
                <h4 className="text-green-600 dark:text-green-400 font-bold text-lg mb-6">In stock</h4>
              ) : (
                <h4 className="text-red-600 font-bold text-lg mb-6">Currently unavailable</h4>
              )}

              {isAuthenticated ? (
                <>
                  <div className="mb-6 flex items-center justify-between">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Quantity:</label>
                    <select 
                      value={quantity} 
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-bold outline-none focus:border-[#FF6B00]"
                    >
                      {[...Array(Math.min(10, product.stock)).keys()].map(x => (
                        <option key={x+1} value={x+1}>{x+1}</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3.5 rounded-full mb-3 transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={18} /> Add to Cart
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                    className="w-full bg-[#FF6B00] hover:bg-[#E65A00] text-white font-bold py-3.5 rounded-full mb-4 transition shadow-sm disabled:opacity-50"
                  >
                    Buy Now
                  </button>
                </>
              ) : (
                <Link to="/login" className="flex items-center justify-center w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3.5 rounded-full mb-4 transition shadow-sm">
                  Sign in to buy
                </Link>
              )}
            </div>

            {/* Seller Information */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2">Seller Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Sold By</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">{product.brand} Retail India</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Rating</span>
                  <span className="font-medium text-gray-900 dark:text-white flex items-center gap-1">4.8 <Star size={12} className="text-yellow-500 fill-yellow-500" /></span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Location</span>
                  <span className="font-medium text-gray-900 dark:text-white">Bengaluru, KA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">GST Verified</span>
                  <span className="font-medium text-green-600 flex items-center gap-1"><Shield size={12} /> Yes</span>
                </div>
              </div>
              <button className="w-full mt-4 text-xs font-bold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                View Seller Store
              </button>
            </div>

          </div>
        </div>

        {/* Detailed Product Info Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-10 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 font-['Poppins']">Product Description & Specifications</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Info className="text-blue-500" /> Description</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                {product.description} <br/><br/>
                Engineered for maximum efficiency, the {product.title} boasts state-of-the-art functionality. 
                Whether you are using it for professional or personal needs, it delivers unparalleled performance. 
                It is crafted with premium materials that ensure a long-lasting lifespan while maintaining an elegant aesthetic.
              </p>
              
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-4 flex items-center gap-2"><Package className="text-orange-500" /> What's in the Box</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-sm space-y-2">
                <li>1 x {product.title}</li>
                <li>1 x User Manual & Warranty Card</li>
                <li>1 x Charging Cable / Accessories</li>
                <li>1 x Original Packaging</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Technical Specifications</h3>
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <tbody>
                    {product.specifications && Object.entries(product.specifications).map(([key, value], idx) => (
                      <tr key={key} className={idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900/50' : 'bg-white dark:bg-gray-800'}>
                        <th className="px-6 py-4 font-bold text-gray-900 dark:text-white border-b border-r border-gray-200 dark:border-gray-700 w-1/3 bg-gray-100 dark:bg-gray-800/80">{key}</th>
                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">{value as string}</td>
                      </tr>
                    ))}
                    <tr className="bg-white dark:bg-gray-800">
                      <th className="px-6 py-4 font-bold text-gray-900 dark:text-white border-b border-r border-gray-200 dark:border-gray-700 w-1/3 bg-gray-100 dark:bg-gray-800/80">Generic Name</th>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">{product.brand} Product</td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-900/50">
                      <th className="px-6 py-4 font-bold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700 w-1/3 bg-gray-100 dark:bg-gray-800/80">Country of Origin</th>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">India</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ProductReviews productId={product.id} />

        {/* Frequently Bought Together / Related */}
        {relatedProducts && relatedProducts.length > 1 && (
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-['Poppins']">Customers who viewed this item also viewed</h2>
            <div className="flex overflow-x-auto gap-6 pb-4 no-scrollbar">
              {relatedProducts.filter((p: any) => p.id !== product.id).slice(0, 6).map((rp: any) => (
                <Link key={rp.id} to={`/products/${rp.id}`} className="w-48 flex-shrink-0 group block border border-gray-100 dark:border-gray-700 rounded-xl p-3 hover:shadow-lg transition">
                  <div className="h-40 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-center p-2 mb-3">
                    <img src={getMatchingImage(rp)} alt="" className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition duration-300" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 hover:text-[#FF6B00] mb-2">{rp.title}</h3>
                  <div className="flex items-center mb-1">
                    <Star className="text-yellow-400 fill-yellow-400" size={12} />
                    <span className="text-xs ml-1 text-gray-500">4.5</span>
                  </div>
                  <div className="font-bold text-gray-900 dark:text-white">{formatPrice(rp.price)}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
      
      <div className="bb-container mt-12 mb-20">
        <RecentlyViewed />
      </div>
    </div>
  );
};

// CreditCard component since it wasn't in lucide imports initially
const CreditCard = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
);

export default ProductDetails;
