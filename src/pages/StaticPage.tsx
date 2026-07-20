import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const pagesData: Record<string, { title: string; content: string }> = {
  'about': {
    title: 'About BharatBazaar',
    content: 'Welcome to BharatBazaar, India\'s most trusted online marketplace. Founded with the vision to empower local sellers and provide customers with the best quality products at unbeatable prices, we have grown into a platform that serves millions across the nation.\n\nOur mission is to build the most customer-centric destination where people can find and discover anything they want to buy online.'
  },
  'careers': {
    title: 'Careers at BharatBazaar',
    content: 'Join the BharatBazaar family! We are always looking for passionate, driven, and innovative individuals to join our team. Whether you are an engineer, a marketer, or a customer service expert, there is a place for you here.\n\nCheck out our open positions on LinkedIn or send your resume to careers@bharatbazaar.in.'
  },
  'press': {
    title: 'Press Releases',
    content: 'Stay up to date with the latest news, announcements, and press releases from BharatBazaar.\n\n- [Oct 2024] BharatBazaar launches Maha Dasara Sale with record-breaking discounts.\n- [Sep 2024] BharatBazaar expands its delivery network to 500+ new tier-2 and tier-3 cities.'
  },
  'science': {
    title: 'BharatBazaar Science',
    content: 'At BharatBazaar, we leverage cutting-edge AI and machine learning to optimize our supply chain, personalize your shopping experience, and ensure the highest quality of service.\n\nOur research teams publish papers annually on supply chain optimization and e-commerce AI.'
  },
  'privacy': {
    title: 'Privacy Policy',
    content: 'Your privacy is important to us. This Privacy Policy explains how BharatBazaar collects, uses, and protects your personal data when you use our website and services.\n\nWe do not sell your personal data to third parties. Your data is encrypted and stored securely.'
  },
  'terms': {
    title: 'Terms & Conditions',
    content: 'By using BharatBazaar, you agree to our Terms & Conditions. These terms govern your use of our platform, purchases, and interactions with third-party sellers.\n\nPlease read them carefully before making a purchase.'
  },
  'returns': {
    title: 'Return Policy',
    content: 'We offer a hassle-free 7-day return policy for most items. If you are not satisfied with your purchase, you can return it in its original condition for a full refund or replacement.\n\nCertain categories like perishable goods and customized items are non-returnable.'
  },
  'refunds': {
    title: 'Refund Policy',
    content: 'Refunds are processed within 3-5 business days after the returned item is received and inspected. The refund will be credited back to your original payment method or BharatBazaar Wallet.'
  },
  'cancellation': {
    title: 'Cancellation Policy',
    content: 'You can cancel your order at any time before it is shipped. Once shipped, the order cannot be cancelled, but you can refuse delivery or initiate a return after receiving it.'
  },
  'help': {
    title: 'Help Center & Support',
    content: 'Need help? Our customer support team is available 24/7 to assist you with orders, returns, and any other inquiries.\n\nCall us: 1800-123-4567\nEmail: support@bharatbazaar.in'
  },
  'shipping': {
    title: 'Shipping Information',
    content: 'We offer fast and reliable shipping across India. Standard delivery takes 3-5 business days. Prime members enjoy free next-day delivery on eligible items.\n\nYou can track your order in real-time from the "My Orders" section.'
  }
};

const StaticPage = () => {
  const location = useLocation();
  const [page, setPage] = useState<{ title: string; content: string } | null>(null);

  useEffect(() => {
    // Extract page key from path, e.g., /page/about -> about
    const pathParts = location.pathname.split('/');
    const pageKey = pathParts[pathParts.length - 1];
    
    if (pagesData[pageKey]) {
      setPage(pagesData[pageKey]);
    } else {
      setPage({ title: 'Page Not Found', content: 'The page you are looking for does not exist.' });
    }
    
    window.scrollTo(0, 0);
  }, [location]);

  if (!page) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-[60vh] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 font-['Poppins'] pb-4 border-b border-gray-100 dark:border-gray-700">
            {page.title}
          </h1>
          <div className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-line">
            {page.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaticPage;
