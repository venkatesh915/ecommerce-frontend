import React from 'react';
import { Link } from 'react-router-dom';
import { Headphones, Mail, MessageSquare, FileText } from 'lucide-react';

const CustomerService = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">How can we help you today?</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Live Chat</h3>
          <p className="text-sm text-gray-500 mb-4">Chat with our support team instantly.</p>
          <button className="text-orange-600 font-medium hover:underline text-sm">Start Chat</button>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Headphones size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Call Us</h3>
          <p className="text-sm text-gray-500 mb-4">Available Mon-Sat, 9 AM - 6 PM</p>
          <a href="tel:1800123456" className="text-orange-600 font-medium hover:underline text-sm">1800 123 456</a>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Email</h3>
          <p className="text-sm text-gray-500 mb-4">Send us an email and we'll reply soon.</p>
          <a href="mailto:support@eshop.com" className="text-orange-600 font-medium hover:underline text-sm">support@eshop.com</a>
        </div>

        <Link to="/orders" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition block">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Your Orders</h3>
          <p className="text-sm text-gray-500 mb-4">Track, return, or cancel an order.</p>
          <span className="text-orange-600 font-medium hover:underline text-sm">View Orders</span>
        </Link>
      </div>

      <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: "What is your return policy?", a: "We offer a 30-day return policy for most items. Items must be in original condition with tags attached." },
            { q: "How long does shipping take?", a: "Standard shipping takes 3-5 business days. Expedited shipping is available at checkout for an additional fee." },
            { q: "Do you ship internationally?", a: "Currently, we only ship within India. We are working on expanding our shipping options soon." }
          ].map((faq, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-bold text-gray-900 mb-2">{faq.q}</h4>
              <p className="text-gray-600 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerService;
