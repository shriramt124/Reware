'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Button from '../../components/ui/Button';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { FiUser, FiPackage, FiRefreshCw, FiAward, FiCalendar, FiEdit, FiPlus } from 'react-icons/fi';

export default function DashboardPage() {
  const { user } = useAuth();
  
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    user: {
      name: user?.name || 'User',
      email: user?.email || 'user@example.com',
      points: user?.points || 0,
      joinedDate: user?.createdAt || 'Recently joined',
      avatar: user?.avatar || '/placeholder-image.svg',
    },
    items: {
      stats: {
        total: 0,
        available: 0,
        pending: 0,
        swapped: 0,
        redeemed: 0
      },
      listings: []
    },
    swaps: {
      stats: {
        total: 0,
        pending: 0,
        accepted: 0,
        completed: 0,
        rejected: 0
      },
      active: [],
      completed: []
    },
    redeemed: []
  });
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/v1/users/dashboard', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setDashboardData(data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    
    if (user) {
      fetchDashboardData();
    }
  }, [user]);
  
  // Use dashboard data or fallback to defaults
  const userData = {
    name: dashboardData?.user?.name || user?.name || 'User',
    email: user?.email || 'user@example.com',
    points: dashboardData?.user?.points || user?.points || 0,
    joinedDate: new Date(dashboardData?.user?.joinedDate || user?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) || 'Recently joined',
    avatar: dashboardData?.user?.avatar || user?.avatar || '/placeholder-image.svg',
  };
  
  // User's listings from API
  const userListings = dashboardData?.items?.listings || [];
  
  // User's completed swaps and redeemed items
  const userPurchases = [
    ...(dashboardData?.swaps?.completed || []).map(swap => ({
      id: swap.id,
      title: swap.isRequester ? swap.requestedItem?.title : swap.offeredItems?.[0]?.title,
      description: '',
      imageSrc: swap.isRequester ? swap.requestedItem?.image : swap.offeredItems?.[0]?.image || '/placeholder-image.svg',
      date: new Date(swap.completedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      type: 'swap',
    })),
    ...(dashboardData?.redeemed || []).map(item => ({
      id: item.id,
      title: item.title,
      description: '',
      imageSrc: item.image || '/placeholder-image.svg',
      date: new Date(item.redemptionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      type: 'points',
    }))
  ];
  
  // Tabs for dashboard sections
  const [activeTab, setActiveTab] = useState('profile');
  
  return (
    <ProtectedRoute>
      <Navbar />
      
      <main className="flex-1 py-10 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">My Dashboard</h1>
            <Button href="/browse" className="flex items-center justify-center">
              <FiRefreshCw className="mr-2" /> Browse Items
            </Button>
          </div>
          
          {/* Dashboard Tabs */}
          <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center justify-center ${activeTab === 'profile' ? 'bg-green-50 text-green-600 border-b-2 border-green-500' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} flex-1 py-4 px-4 font-medium text-sm transition-all duration-200`}
              >
                <FiUser className="mr-2 h-5 w-5" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('listings')}
                className={`flex items-center justify-center ${activeTab === 'listings' ? 'bg-green-50 text-green-600 border-b-2 border-green-500' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} flex-1 py-4 px-4 font-medium text-sm transition-all duration-200`}
              >
                <FiPackage className="mr-2 h-5 w-5" />
                My Listings
              </button>
              <button
                onClick={() => setActiveTab('purchases')}
                className={`flex items-center justify-center ${activeTab === 'purchases' ? 'bg-green-50 text-green-600 border-b-2 border-green-500' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} flex-1 py-4 px-4 font-medium text-sm transition-all duration-200`}
              >
                <FiRefreshCw className="mr-2 h-5 w-5" />
                My Swaps & Purchases
              </button>
            </nav>
          </div>
          
          {/* Profile Tab Content */}
          {activeTab === 'profile' && (
            <div className="bg-white shadow-md rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                  <div className="relative h-36 w-36 rounded-full overflow-hidden border-4 border-white shadow-md">
                    <Image 
                      src={userData?.avatar || '/placeholder-image.svg'} 
                      alt={userData?.name || 'User profile'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-3xl font-bold text-gray-900">{userData?.name || 'User'}</h2>
                    <p className="text-gray-600">{userData?.email || 'user@example.com'}</p>
                    <div className="flex items-center mt-2 justify-center sm:justify-start">
                      <FiCalendar className="text-gray-500 mr-2" />
                      <p className="text-sm text-gray-500">Member since {userData?.joinedDate || 'Recently joined'}</p>
                    </div>
                    
                    <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center">
                      <div className="bg-white shadow-sm px-6 py-3 rounded-full flex items-center">
                        <FiAward className="text-green-600 mr-2" />
                        <span className="text-green-700 font-medium">{userData?.points || 0} Points Available</span>
                      </div>
                      
                      <Button href="/dashboard/edit-profile" variant="outline" size="sm" className="flex items-center">
                        <FiEdit className="mr-2" /> Edit Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FiUser className="mr-2 text-green-600" /> Account Statistics
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                    <div className="text-4xl font-bold text-green-600 mb-2">{dashboardData?.items?.stats?.total || 0}</div>
                    <p className="text-gray-700 font-medium">Items Listed</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{dashboardData?.swaps?.stats?.completed || 0}</div>
                    <p className="text-gray-700 font-medium">Successful Swaps</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                    <div className="text-4xl font-bold text-purple-600 mb-2">{dashboardData?.redeemed?.length || 0}</div>
                    <p className="text-gray-700 font-medium">Point Redemptions</p>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Environmental Impact</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 mr-4">
                          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">CO₂ Emissions Saved</p>
                          <p className="text-xl font-bold text-gray-900">{((dashboardData?.items?.stats?.swapped || 0) + (dashboardData?.redeemed?.length || 0)) * 3} kg</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 mr-4">
                          <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Water Saved</p>
                          <p className="text-xl font-bold text-gray-900">{((dashboardData?.items?.stats?.swapped || 0) + (dashboardData?.redeemed?.length || 0)) * 150} L</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Listings Tab Content */}
          {activeTab === 'listings' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FiPackage className="mr-2 text-green-600" /> My Listed Items
                </h2>
                <Button href="/items/new" size="sm" className="flex items-center">
                  <FiPlus className="mr-2" /> Add New Item
                </Button>
              </div>
              
              {userListings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userListings.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      <div className="relative h-52 w-full">
                        <Image 
                          src={item.image || '/placeholder-image.svg'} 
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                        
                        {item.status === 'pending' && (
                          <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                            Swap Pending
                          </div>
                        )}
                      </div>
                      
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{item.description}</p>
                        
                        <div className="mt-5 flex justify-between items-center">
                          <Link 
                            href={`/items/${item.id}`}
                            className="text-sm text-gray-600 hover:text-green-600 flex items-center"
                          >
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View details
                          </Link>
                          
                          <Button 
                            href={`/items/${item.id}/edit`} 
                            variant="outline" 
                            size="sm"
                            className="flex items-center"
                          >
                            <FiEdit className="mr-1" /> Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-xl shadow-md text-center">
                  <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                    <FiPackage className="h-8 w-8 text-gray-500" />
                  </div>
                  <p className="text-gray-600 mb-4">You haven't listed any items yet.</p>
                  <Button href="/items/new" className="flex items-center mx-auto">
                    <FiPlus className="mr-2" /> List Your First Item
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {/* Purchases Tab Content */}
          {activeTab === 'purchases' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <FiRefreshCw className="mr-2 text-green-600" /> My Swaps & Purchases
              </h2>
              
              {userPurchases.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userPurchases.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      <div className="relative h-52 w-full">
                        <Image 
                          src={item.imageSrc || '/placeholder-image.svg'} 
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                        
                        <div className={`absolute top-3 right-3 ${item.type === 'swap' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'} text-xs font-medium px-3 py-1 rounded-full shadow-sm`}>
                          {item.type === 'swap' ? 'Swapped' : 'Redeemed with Points'}
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{item.description}</p>
                        
                        <div className="mt-5 space-y-3">
                          <div className="flex items-center">
                            <FiCalendar className="text-gray-400 mr-2" />
                            <p className="text-sm text-gray-500">Acquired on {item.date}</p>
                          </div>
                          
                          <Link 
                            href={`/items/${item.id}`}
                            className="inline-flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors"
                          >
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-xl shadow-md text-center">
                  <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                    <FiRefreshCw className="h-8 w-8 text-gray-500" />
                  </div>
                  <p className="text-gray-600 mb-4">You haven't acquired any items yet.</p>
                  <Button href="/browse" className="flex items-center mx-auto">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Browse Available Items
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </ProtectedRoute>
  );
}