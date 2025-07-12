'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Button from '../../../components/ui/Button';

export default function ItemDetailPage() {
  const params = useParams();
  const itemId = params.id;
  
  // Mock item data - in a real app, this would be fetched based on the ID
  const item = {
    id: itemId,
    title: 'Denim Jacket',
    description: 'Lightly worn denim jacket, perfect for fall weather. This classic piece features button closures, two chest pockets, and side pockets. The fabric is soft and comfortable with minimal signs of wear. Great for casual outings or layering over t-shirts.',
    images: [
      '/placeholder-image.svg',
      '/placeholder-image.svg',
      '/placeholder-image.svg',
    ],
    category: 'Outerwear',
    size: 'M',
    condition: 'Good',
    pointsValue: 50,
    uploader: {
      id: 'user123',
      name: 'Alex Johnson',
      avatar: '/placeholder-image.svg',
      joinedDate: 'January 2023',
      successfulSwaps: 15,
    },
    tags: ['denim', 'jacket', 'casual', 'fall', 'blue'],
    uploadedDate: 'October 10, 2023',
    status: 'available', // available, pending, swapped
  };
  
  // State for the current image in the gallery
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // State for swap request modal
  const [showSwapModal, setShowSwapModal] = useState(false);
  
  // State for redeem confirmation modal
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  
  // Mock user data - in a real app, this would come from authentication
  const user = {
    id: 'user456',
    name: 'Jane Smith',
    points: 100,
    items: [
      { id: 'item1', title: 'Summer Dress', image: '/placeholder-image.svg' },
      { id: 'item2', title: 'Running Shoes', image: '/placeholder-image.svg' },
    ],
  };
  
  // State for selected item to swap
  const [selectedSwapItem, setSelectedSwapItem] = useState('');
  
  // Handle swap request submission
  const handleSwapRequest = () => {
    console.log('Swap requested with item:', selectedSwapItem);
    // In a real app, this would send the request to the backend
    setShowSwapModal(false);
    // Show success message or redirect
  };
  
  // Handle redeem with points
  const handleRedeem = () => {
    console.log('Item redeemed with points');
    // In a real app, this would process the redemption
    setShowRedeemModal(false);
    // Show success message or redirect
  };
  
  return (
    <>
      <Navbar />
      
      <main className="flex-1 py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <Link href="/browse" className="text-sm text-gray-500 hover:text-gray-700">
                    Browse
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-sm text-gray-700">{item.title}</span>
                </div>
              </li>
            </ol>
          </nav>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              {/* Image Gallery */}
              <div>
                <div className="relative h-96 w-full mb-4 rounded-lg overflow-hidden">
                  <Image 
                    src={item.images[currentImageIndex]} 
                    alt={`${item.title} - Image ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                  />
                  
                  {item.status === 'pending' && (
                    <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                      Swap Pending
                    </div>
                  )}
                  
                  {item.status === 'swapped' && (
                    <div className="absolute top-4 right-4 bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                      No Longer Available
                    </div>
                  )}
                </div>
                
                {/* Thumbnail Gallery */}
                {item.images.length > 1 && (
                  <div className="flex space-x-2">
                    {item.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative h-20 w-20 rounded-md overflow-hidden ${index === currentImageIndex ? 'ring-2 ring-green-500' : 'opacity-70 hover:opacity-100'}`}
                      >
                        <Image 
                          src={image} 
                          alt={`${item.title} - Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Item Details */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h1>
                
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    {item.pointsValue} Points
                  </div>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-sm text-gray-600">Added on {item.uploadedDate}</span>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-2">Description</h2>
                  <p className="text-gray-700">{item.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Category</h3>
                    <p className="text-gray-900">{item.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Size</h3>
                    <p className="text-gray-900">{item.size}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Condition</h3>
                    <p className="text-gray-900">{item.condition}</p>
                  </div>
                </div>
                
                {/* Tags */}
                {item.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Action Buttons */}
                {item.status === 'available' && (
                  <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Button 
                      onClick={() => setShowSwapModal(true)} 
                      className="flex-1"
                    >
                      Request Swap
                    </Button>
                    <Button 
                      onClick={() => setShowRedeemModal(true)} 
                      variant="outline" 
                      className="flex-1"
                    >
                      Redeem with Points
                    </Button>
                  </div>
                )}
                
                {item.status === 'pending' && (
                  <div className="mt-8">
                    <div className="bg-yellow-50 p-4 rounded-md">
                      <p className="text-yellow-800">This item has a pending swap request. It may no longer be available.</p>
                    </div>
                  </div>
                )}
                
                {item.status === 'swapped' && (
                  <div className="mt-8">
                    <div className="bg-red-50 p-4 rounded-md">
                      <p className="text-red-800">This item has been swapped and is no longer available.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Uploader Info */}
            <div className="border-t border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">About the Owner</h2>
              
              <div className="flex items-center">
                <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                  <Image 
                    src={item.uploader.avatar} 
                    alt={item.uploader.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div>
                  <h3 className="text-base font-medium text-gray-900">{item.uploader.name}</h3>
                  <p className="text-sm text-gray-500">Member since {item.uploader.joinedDate}</p>
                  <p className="text-sm text-gray-500">{item.uploader.successfulSwaps} successful swaps</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Swap Request Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Request a Swap</h3>
              
              <p className="text-gray-600 mb-4">Select one of your items to offer for a swap with <span className="font-medium">{item.title}</span>.</p>
              
              {user.items.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {user.items.map((userItem) => (
                    <label key={userItem.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input 
                        type="radio" 
                        name="swapItem" 
                        value={userItem.id}
                        checked={selectedSwapItem === userItem.id}
                        onChange={() => setSelectedSwapItem(userItem.id)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <div className="ml-3 flex items-center">
                        <div className="relative h-12 w-12 rounded-md overflow-hidden mr-3">
                          <Image 
                            src={userItem.image} 
                            alt={userItem.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-gray-900">{userItem.title}</span>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="bg-yellow-50 p-4 rounded-md mb-6">
                  <p className="text-yellow-800">You don't have any items to swap. List an item first!</p>
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <Button 
                  onClick={() => setShowSwapModal(false)} 
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSwapRequest}
                  disabled={!selectedSwapItem || user.items.length === 0}
                >
                  Request Swap
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Redeem Confirmation Modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Redeem with Points</h3>
              
              <p className="text-gray-600 mb-4">Are you sure you want to redeem <span className="font-medium">{item.title}</span> for <span className="font-medium">{item.pointsValue} points</span>?</p>
              
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Your current points:</span>
                  <span className="font-medium">{user.points}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-700">Item cost:</span>
                  <span className="font-medium text-red-600">-{item.pointsValue}</span>
                </div>
                <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Remaining points:</span>
                  <span className="font-medium">{user.points - item.pointsValue}</span>
                </div>
              </div>
              
              {user.points < item.pointsValue && (
                <div className="bg-red-50 p-4 rounded-md mb-6">
                  <p className="text-red-800">You don't have enough points to redeem this item.</p>
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <Button 
                  onClick={() => setShowRedeemModal(false)} 
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleRedeem}
                  disabled={user.points < item.pointsValue}
                >
                  Confirm Redemption
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </>
  );
}