import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, CheckCircle, Edit, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

interface Review {
  id: string;
  productId: number;
  userId: number;
  userName: string;
  rating: number;
  title: string;
  description: string;
  date: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

interface ProductReviewsProps {
  productId: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const { user, isAuthenticated } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Load reviews from local storage
  useEffect(() => {
    const allReviews: Review[] = JSON.parse(localStorage.getItem('bb_reviews') || '[]');
    const productReviews = allReviews.filter(r => r.productId === productId);
    
    // Seed some mock data if empty
    if (productReviews.length === 0) {
      const mockReviews: Review[] = [
        {
          id: `mock_1_${productId}`,
          productId,
          userId: 9991,
          userName: "Rahul Sharma",
          rating: 5,
          title: "Excellent Product! Highly Recommended",
          description: "I have been using this for a week now and it exceeded my expectations. The build quality is top-notch and delivery was super fast via BharatBazaar.",
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          verifiedPurchase: true,
          helpfulCount: 12
        },
        {
          id: `mock_2_${productId}`,
          productId,
          userId: 9992,
          userName: "Priya Singh",
          rating: 4,
          title: "Good value for money",
          description: "Overall good product. The packaging was a bit damaged but the product inside was perfectly fine. Serves the purpose well.",
          date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          verifiedPurchase: true,
          helpfulCount: 5
        }
      ];
      
      const updatedStorage = [...allReviews, ...mockReviews];
      localStorage.setItem('bb_reviews', JSON.stringify(updatedStorage));
      setReviews(mockReviews);
    } else {
      setReviews(productReviews);
    }
  }, [productId]);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      toast.error('Please login to submit a review');
      return;
    }

    const allReviews: Review[] = JSON.parse(localStorage.getItem('bb_reviews') || '[]');
    
    if (editingId) {
      const updatedReviews = allReviews.map(r => 
        r.id === editingId ? { ...r, rating, title, description, date: new Date().toISOString() } : r
      );
      localStorage.setItem('bb_reviews', JSON.stringify(updatedReviews));
      setReviews(updatedReviews.filter(r => r.productId === productId));
      toast.success('Review updated successfully!');
    } else {
      const newReview: Review = {
        id: `rev_${Date.now()}`,
        productId,
        userId: user.id,
        userName: user.full_name || 'Customer',
        rating,
        title,
        description,
        date: new Date().toISOString(),
        verifiedPurchase: true, // Assuming true for mock
        helpfulCount: 0
      };
      
      const updatedReviews = [newReview, ...allReviews];
      localStorage.setItem('bb_reviews', JSON.stringify(updatedReviews));
      setReviews(updatedReviews.filter(r => r.productId === productId));
      toast.success('Review submitted successfully!');
    }

    setShowForm(false);
    setEditingId(null);
    setRating(5);
    setTitle('');
    setDescription('');
  };

  const handleEdit = (review: Review) => {
    setEditingId(review.id);
    setRating(review.rating);
    setTitle(review.title);
    setDescription(review.description);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    const allReviews: Review[] = JSON.parse(localStorage.getItem('bb_reviews') || '[]');
    const updatedReviews = allReviews.filter(r => r.id !== id);
    localStorage.setItem('bb_reviews', JSON.stringify(updatedReviews));
    setReviews(updatedReviews.filter(r => r.productId === productId));
    toast.success('Review deleted');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-['Poppins'] mb-2">Customer Reviews</h2>
          <div className="flex items-center gap-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} size={20} className={star <= Number(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"} />
              ))}
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">{averageRating} out of 5</span>
            <span className="text-gray-500 dark:text-gray-400">({reviews.length} global ratings)</span>
          </div>
        </div>
        <button 
          onClick={() => {
            if (!isAuthenticated) {
              toast.error('Please login to write a review');
              return;
            }
            setShowForm(!showForm);
            setEditingId(null);
            setRating(5);
            setTitle('');
            setDescription('');
          }}
          className="mt-4 md:mt-0 bb-button-primary px-6 py-2.5"
        >
          {showForm ? 'Cancel Review' : 'Write a Review'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-xl border border-gray-200 dark:border-gray-600 mb-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{editingId ? 'Edit Review' : 'Create Review'}</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Overall Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <Star 
                  key={star} 
                  size={32} 
                  onClick={() => setRating(star)}
                  className={`cursor-pointer transition-transform hover:scale-110 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`} 
                />
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Add a headline</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's most important to know?"
              className="w-full border dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF6B00] outline-none"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Add a written review</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What did you like or dislike? What did you use this product for?"
              className="w-full border dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 text-gray-900 dark:text-white h-32 focus:ring-2 focus:ring-[#FF6B00] outline-none"
              required
            />
          </div>
          
          <button type="submit" className="bb-button-primary px-8 py-2.5">Submit</button>
        </form>
      )}

      <div className="space-y-6">
        {reviews.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(review => (
          <div key={review.id} className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">
                {review.userName.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">{review.userName}</h4>
                {review.verifiedPurchase && (
                  <span className="text-xs text-[#FF6B00] font-medium flex items-center gap-1">
                    <CheckCircle size={12} /> Verified Purchase
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} size={14} className={star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"} />
                ))}
              </div>
              <h5 className="font-bold text-gray-900 dark:text-white">{review.title}</h5>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Reviewed in India on {new Date(review.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">{review.description}</p>
            
            <div className="flex items-center justify-between">
              <button className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 px-3 py-1 rounded-full flex items-center gap-1 transition">
                <ThumbsUp size={12} /> Helpful ({review.helpfulCount})
              </button>
              
              {isAuthenticated && user?.id === review.userId && (
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(review)} className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-1.5 rounded transition">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(review.id)} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 p-1.5 rounded transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;
