import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';
import RecentlyViewed from '@/components/product/RecentlyViewed';
import { User, Mail, Shield, MapPin, Plus, Trash2, CheckCircle, Smartphone, Calendar, UserCheck, CreditCard, Gift, Ticket, Package, Star, LogOut, Settings, History, Heart } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addressApi, type AddressCreate } from '@/api/addressApi';
import { authApi } from '@/api/authApi';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'info' | 'addresses' | 'orders' | 'reviews'>('info');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddressCreate>();

  const { data: addresses, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: addressApi.getAddresses,
  });

  const addAddressMutation = useMutation({
    mutationFn: addressApi.createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address added successfully');
      setShowAddForm(false);
      reset();
    },
    onError: () => toast.error('Failed to add address'),
  });

  const deleteAddressMutation = useMutation({
    mutationFn: addressApi.deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address deleted');
    }
  });

  const setDefaultMutation = useMutation({
    mutationFn: addressApi.setDefaultAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Default address updated');
    }
  });

  const onSubmit = (data: AddressCreate) => {
    addAddressMutation.mutate(data);
  };

  const changePasswordMutation = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully');
      setShowPasswordModal(false);
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to change password');
    }
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.new_password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    changePasswordMutation.mutate({
      current_password: passwordData.current_password,
      new_password: passwordData.new_password
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  // Mock data for new requested fields
  const mockData = {
    mobile: "+91 9876543210",
    gender: "Male",
    dob: "15 Aug 1995",
    walletBalance: 1250.00,
    rewardPoints: 450,
    couponsCount: 3,
    ordersCount: 12,
    reviewsCount: 5,
    memberSince: "Jan 2024"
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-16 pt-8">
      <div className="bb-container">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 font-['Poppins']">My Account</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar / Quick Stats */}
          <div className="w-full lg:w-1/3 space-y-6">
            
            {/* User Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-24 relative"></div>
              <div className="px-6 pb-6 relative">
                <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-md border border-gray-100 dark:border-gray-700 absolute -top-12">
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <User size={40} className="text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
                <div className="pt-14">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-none">{user?.full_name || 'User'}</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{user?.email}</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 font-medium mt-2 bg-orange-50 dark:bg-orange-900/30 inline-block px-2 py-1 rounded">Member since {mockData.memberSince}</p>
                </div>
              </div>
            </div>

            {/* Wallet & Rewards Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><CreditCard size={18} className="text-[#FF6B00]" /> BharatBazaar Pay</h3>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl mb-3 border border-gray-100 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center"><CreditCard size={20} /></div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Wallet Balance</p>
                    <p className="font-bold text-gray-900 dark:text-white">₹{mockData.walletBalance.toFixed(2)}</p>
                  </div>
                </div>
                <button className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">Add Money</button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl mb-3 border border-gray-100 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center justify-center"><Gift size={20} /></div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Reward Points</p>
                    <p className="font-bold text-gray-900 dark:text-white">{mockData.rewardPoints} Pts</p>
                  </div>
                </div>
                <button className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">Redeem</button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center"><Ticket size={20} /></div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Active Coupons</p>
                    <p className="font-bold text-gray-900 dark:text-white">{mockData.couponsCount} Available</p>
                  </div>
                </div>
                <button className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">View</button>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-2">
              <button onClick={() => setActiveTab('info')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${activeTab === 'info' ? 'bg-orange-50 dark:bg-orange-900/20 text-[#FF6B00]' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                <UserCheck size={18} /> Personal Information
              </button>
              <button onClick={() => setActiveTab('addresses')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${activeTab === 'addresses' ? 'bg-orange-50 dark:bg-orange-900/20 text-[#FF6B00]' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                <MapPin size={18} /> Saved Addresses
              </button>
              <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition font-medium ${activeTab === 'orders' ? 'bg-orange-50 dark:bg-orange-900/20 text-[#FF6B00]' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                <div className="flex items-center gap-3"><Package size={18} /> Order History</div>
                <span className="bg-gray-100 dark:bg-gray-700 text-xs px-2 py-0.5 rounded-full">{mockData.ordersCount}</span>
              </button>
              <button onClick={() => setActiveTab('reviews')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition font-medium ${activeTab === 'reviews' ? 'bg-orange-50 dark:bg-orange-900/20 text-[#FF6B00]' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                <div className="flex items-center gap-3"><Star size={18} /> My Reviews</div>
                <span className="bg-gray-100 dark:bg-gray-700 text-xs px-2 py-0.5 rounded-full">{mockData.reviewsCount}</span>
              </button>
              <Link to="/wishlist" className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center gap-3"><Heart size={18} /> Wishlist</div>
                <span className="bg-gray-100 dark:bg-gray-700 text-xs px-2 py-0.5 rounded-full">{wishlistItems.length}</span>
              </Link>
              <Link to="/profile" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                <History size={18} /> Recently Viewed
              </Link>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-t border-gray-100 dark:border-gray-700 mt-2">
                <Settings size={18} /> Account Settings
              </button>
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10">
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
              
              {/* Tab: Info */}
              {activeTab === 'info' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white font-['Poppins']">Personal Information</h3>
                    <button className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">Edit Profile</button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-600">
                      <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm"><User className="text-gray-500" size={18} /></div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Full Name</p>
                        <p className="font-bold text-gray-900 dark:text-white">{user?.full_name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-600">
                      <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm"><Mail className="text-gray-500" size={18} /></div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Email Address</p>
                        <p className="font-bold text-gray-900 dark:text-white">{user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-600">
                      <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm"><Smartphone className="text-gray-500" size={18} /></div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Mobile Number</p>
                        <p className="font-bold text-gray-900 dark:text-white">{mockData.mobile}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-600">
                      <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm"><UserCheck className="text-gray-500" size={18} /></div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Gender</p>
                        <p className="font-bold text-gray-900 dark:text-white">{mockData.gender}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-600">
                      <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm"><Calendar className="text-gray-500" size={18} /></div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Date of Birth</p>
                        <p className="font-bold text-gray-900 dark:text-white">{mockData.dob}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-600">
                      <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm"><Shield className="text-gray-500" size={18} /></div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Account Role</p>
                        <p className="font-bold text-gray-900 dark:text-white capitalize">{user?.role}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-6">
                    <button onClick={() => setShowPasswordModal(true)} className="bb-button-primary px-6 py-2.5">Change Password</button>
                  </div>
                </div>
              )}

              {/* Tab: Addresses */}
              {activeTab === 'addresses' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white font-['Poppins']">Saved Addresses</h3>
                    <button 
                      onClick={() => setShowAddForm(!showAddForm)}
                      className="flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-lg font-bold hover:bg-orange-200 dark:hover:bg-orange-900/50 transition"
                    >
                      <Plus size={18} /> Add New
                    </button>
                  </div>

                  {showAddForm && (
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 mb-8 grid md:grid-cols-2 gap-4 shadow-sm">
                      <div className="md:col-span-2 text-lg font-bold text-gray-900 dark:text-white mb-2 border-b border-gray-200 dark:border-gray-600 pb-2">New Address Details</div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                        <input {...register('full_name', { required: true })} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF6B00] outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                        <input {...register('phone', { required: true })} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF6B00] outline-none" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Street Address / Landmark</label>
                        <input {...register('address', { required: true })} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF6B00] outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">City</label>
                        <input {...register('city', { required: true })} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF6B00] outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">State</label>
                        <input {...register('state', { required: true })} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF6B00] outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Pincode</label>
                        <input {...register('pincode', { required: true })} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FF6B00] outline-none" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Address Type</label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2"><input type="radio" name="type" defaultChecked /> Home (All day delivery)</label>
                          <label className="flex items-center gap-2"><input type="radio" name="type" /> Work (Delivery between 10 AM - 5 PM)</label>
                        </div>
                      </div>
                      
                      <div className="md:col-span-2 flex justify-end gap-3 mt-4 border-t border-gray-200 dark:border-gray-600 pt-4">
                        <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold">Cancel</button>
                        <button type="submit" disabled={addAddressMutation.isPending} className="bb-button-primary px-6 py-2 disabled:opacity-50">
                          {addAddressMutation.isPending ? 'Saving...' : 'Save Address'}
                        </button>
                      </div>
                    </form>
                  )}

                  {isLoading ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {[1, 2].map(i => <div key={i} className="h-40 bg-gray-100 dark:bg-gray-700 rounded-2xl animate-pulse"></div>)}
                    </div>
                  ) : addresses?.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-800">
                      <MapPin size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No addresses found</h4>
                      <p>Please add a billing or shipping address to continue.</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {addresses?.map(addr => (
                        <div key={addr.id} className={`p-6 rounded-2xl border-2 transition relative ${addr.is_default ? 'border-[#FF6B00] bg-orange-50 dark:bg-orange-900/10 shadow-md' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
                          {addr.is_default && (
                            <div className="absolute top-4 right-4 text-[#FF6B00] flex items-center gap-1 text-xs font-bold bg-orange-100 dark:bg-orange-900/50 px-2.5 py-1 rounded-full">
                              <CheckCircle size={14} /> Default Billing/Shipping
                            </div>
                          )}
                          <div className="mb-2">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Home</span>
                          </div>
                          <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{addr.full_name}</h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 font-medium">{addr.phone}</p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
                            {addr.address}<br />
                            {addr.city}, {addr.state} - {addr.pincode}<br/>
                            India
                          </p>
                          
                          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                            {!addr.is_default && (
                              <button 
                                onClick={() => setDefaultMutation.mutate(addr.id)}
                                className="text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline flex-1 text-left"
                              >
                                Set as default
                              </button>
                            )}
                            <button className="text-sm text-gray-600 dark:text-gray-400 font-bold hover:underline">Edit</button>
                            <button 
                              onClick={() => deleteAddressMutation.mutate(addr.id)}
                              className="text-sm text-red-600 dark:text-red-400 font-bold hover:underline ml-2"
                              aria-label="Delete Address"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Orders (Mock UI) */}
              {activeTab === 'orders' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white font-['Poppins']">Order History</h3>
                    <Link to="/orders" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">View All Orders</Link>
                  </div>
                  
                  <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center bg-gray-50 dark:bg-gray-800">
                    <Package size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">You have 12 past orders</h4>
                    <p className="text-gray-500 mb-4">Track, return, or buy items again from your past orders.</p>
                    <Link to="/orders" className="bb-button-primary px-6 py-2.5 inline-block">Go to Orders</Link>
                  </div>
                </div>
              )}

              {/* Tab: Reviews (Mock UI) */}
              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white font-['Poppins'] mb-6">My Reviews</h3>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center bg-gray-50 dark:bg-gray-800">
                    <Star size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">You have submitted 5 reviews</h4>
                    <p className="text-gray-500">Your reviews help other shoppers make better decisions.</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        <div className="mt-8 mb-12">
          <RecentlyViewed />
        </div>

        {/* Change Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Change Password</h3>
                <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl font-bold">&times;</button>
              </div>
              <div className="p-6">
                <form id="passwordForm" onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                    <input
                      type="password"
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                    <input
                      type="password"
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 dark:text-white"
                      required
                      minLength={6}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 dark:text-white"
                      required
                      minLength={6}
                    />
                  </div>
                </form>
              </div>
              <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition font-medium">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  form="passwordForm"
                  disabled={changePasswordMutation.isPending}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition font-medium disabled:opacity-50"
                >
                  {changePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
