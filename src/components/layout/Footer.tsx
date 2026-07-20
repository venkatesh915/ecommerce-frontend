import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const Footer = () => {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Successfully subscribed to Newsletter!');
    (e.target as HTMLFormElement).reset();
  };
  return (
    <footer className="bg-[#0F172A] text-white mt-auto border-t-4 border-[#FF6B00]">
      
      {/* Top Banner - Back to top */}
      <div 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="bg-[#1E293B] hover:bg-slate-700 text-center py-3 cursor-pointer transition text-sm font-medium"
      >
        Back to top
      </div>

      <div className="bb-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Column 1 */}
          <div>
            <h3 className="text-lg font-bold mb-5 font-['Poppins'] text-gray-100">Get to Know Us</h3>
            <ul className="space-y-3 text-sm text-gray-400 font-medium">
              <li><Link to="/page/about" className="hover:text-white transition">About BharatBazaar</Link></li>
              <li><Link to="/page/careers" className="hover:text-white transition">Careers</Link></li>
              <li><Link to="/page/press" className="hover:text-white transition">Press Releases</Link></li>
              <li><Link to="/page/science" className="hover:text-white transition">BharatBazaar Science</Link></li>
            </ul>
          </div>
          
          {/* Column 2 */}
          <div>
            <h3 className="text-lg font-bold mb-5 font-['Poppins'] text-gray-100">Connect with Us</h3>
            <ul className="space-y-3 text-sm text-gray-400 font-medium mb-6">
              <li><a href="#" className="hover:text-white transition">Facebook</a></li>
              <li><a href="#" className="hover:text-white transition">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition">Instagram</a></li>
            </ul>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition flex items-center gap-1"><ExternalLink size={16} /> FB</a>
              <a href="#" className="text-gray-400 hover:text-white transition flex items-center gap-1"><ExternalLink size={16} /> TW</a>
              <a href="#" className="text-gray-400 hover:text-white transition flex items-center gap-1"><ExternalLink size={16} /> IG</a>
              <a href="#" className="text-gray-400 hover:text-white transition flex items-center gap-1"><ExternalLink size={16} /> YT</a>
            </div>
          </div>
          
          {/* Column 3 */}
          <div>
            <h3 className="text-lg font-bold mb-5 font-['Poppins'] text-gray-100">Make Money with Us</h3>
            <ul className="space-y-3 text-sm text-gray-400 font-medium">
              <li><Link to="/products?q=sell" className="hover:text-white transition">Sell on BharatBazaar</Link></li>
              <li><Link to="/products?q=accelerator" className="hover:text-white transition">Sell under BharatBazaar Accelerator</Link></li>
              <li><Link to="/products?q=brand" className="hover:text-white transition">Protect and Build Your Brand</Link></li>
              <li><Link to="/products?q=affiliate" className="hover:text-white transition">Become an Affiliate</Link></li>
              <li><Link to="/products?q=advertise" className="hover:text-white transition">Advertise Your Products</Link></li>
            </ul>
          </div>
          
          {/* Column 4 - Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-5 font-['Poppins'] text-gray-100">Subscribe & Save</h3>
            <p className="text-sm text-gray-400 mb-4">Get the latest deals and offers delivered straight to your inbox.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-500" />
                </div>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-slate-800 border border-slate-600 text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#FF6B00] transition"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-[#FF6B00] hover:bg-[#E65A00] text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition"
              >
                Subscribe <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 bg-[#0B1120]">
        <div className="bb-container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
            <div className="flex gap-6">
              <Link to="/page/terms" className="hover:text-white transition">Conditions of Use & Sale</Link>
              <Link to="/page/privacy" className="hover:text-white transition">Privacy Notice</Link>
              <Link to="/page/returns" className="hover:text-white transition">Return Policy</Link>
            </div>
            <p>&copy; {new Date().getFullYear()}, BharatBazaar.com, Inc. or its affiliates</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
