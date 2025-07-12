'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Button from '../../components/ui/Button';

export default function BrowsePage() {
  // Mock items data
  const items = [
    {
      id: 1,
      title: 'Denim Jacket',
      description: 'Lightly worn denim jacket, perfect for fall weather',
      imageSrc: '/placeholder-image.svg',
      category: 'Outerwear',
      size: 'M',
      condition: 'Good',
      pointsValue: 50,
      uploader: 'Alex Johnson',
    },
    {
      id: 2,
      title: 'Summer Dress',
      description: 'Floral pattern summer dress, worn only twice',
      imageSrc: '/placeholder-image.svg',
      category: 'Dresses',
      size: 'S',
      condition: 'Like New',
      pointsValue: 75,
      uploader: 'Maria Garcia',
    },
    {
      id: 3,
      title: 'Running Shoes',
      description: 'Lightly used running shoes, size 9',
      imageSrc: '/placeholder-image.svg',
      category: 'Shoes',
      size: '9',
      condition: 'Good',
      pointsValue: 60,
      uploader: 'David Kim',
    },
    {
      id: 4,
      title: 'Winter Sweater',
      description: 'Warm wool sweater in excellent condition',
      imageSrc: '/placeholder-image.svg',
      category: 'Tops',
      size: 'L',
      condition: 'Excellent',
      pointsValue: 65,
      uploader: 'Sarah Williams',
    },
    {
      id: 5,
      title: 'Leather Belt',
      description: 'Classic brown leather belt, barely used',
      imageSrc: '/placeholder-image.svg',
      category: 'Accessories',
      size: '32',
      condition: 'Like New',
      pointsValue: 30,
      uploader: 'James Smith',
    },
    {
      id: 6,
      title: 'Casual T-Shirt',
      description: 'Cotton t-shirt with graphic print',
      imageSrc: '/placeholder-image.svg',
      category: 'Tops',
      size: 'XL',
      condition: 'Good',
      pointsValue: 25,
      uploader: 'Emily Chen',
    },
  ];

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  
  // Available filter options
  const categories = ['Outerwear', 'Dresses', 'Tops', 'Bottoms', 'Shoes', 'Accessories'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '6', '7', '8', '9', '10', '11', '12'];
  const conditions = ['Like New', 'Excellent', 'Good', 'Fair'];
  
  // Filter items based on selected filters
  const filteredItems = items.filter(item => {
    // Search term filter
    if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !item.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (categoryFilter && item.category !== categoryFilter) {
      return false;
    }
    
    // Size filter
    if (sizeFilter && item.size !== sizeFilter) {
      return false;
    }
    
    // Condition filter
    if (conditionFilter && item.condition !== conditionFilter) {
      return false;
    }
    
    return true;
  });
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setSizeFilter('');
    setConditionFilter('');
  };
  
  return (
    <>
      <Navbar />
      
      <main className="flex-1 py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Browse Items</h1>
            <Button href="/items/new" className="mt-4 md:mt-0">
              List Your Item
            </Button>
          </div>
          
          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* Search input */}
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title or description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              {/* Category filter */}
              <div className="w-full md:w-48">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  id="category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              {/* Size filter */}
              <div className="w-full md:w-36">
                <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                <select
                  id="size"
                  value={sizeFilter}
                  onChange={(e) => setSizeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">All Sizes</option>
                  {sizes.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              
              {/* Condition filter */}
              <div className="w-full md:w-36">
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                <select
                  id="condition"
                  value={conditionFilter}
                  onChange={(e) => setConditionFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Any Condition</option>
                  {conditions.map((condition) => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Active filters and reset */}
            <div className="flex flex-wrap items-center gap-2">
              {(searchTerm || categoryFilter || sizeFilter || conditionFilter) && (
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Active filters:</span>
                  {searchTerm && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                      Search: {searchTerm}
                      <button 
                        onClick={() => setSearchTerm('')} 
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        &times;
                      </button>
                    </span>
                  )}
                  {categoryFilter && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                      Category: {categoryFilter}
                      <button 
                        onClick={() => setCategoryFilter('')} 
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        &times;
                      </button>
                    </span>
                  )}
                  {sizeFilter && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                      Size: {sizeFilter}
                      <button 
                        onClick={() => setSizeFilter('')} 
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        &times;
                      </button>
                    </span>
                  )}
                  {conditionFilter && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                      Condition: {conditionFilter}
                      <button 
                        onClick={() => setConditionFilter('')} 
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        &times;
                      </button>
                    </span>
                  )}
                  <button 
                    onClick={resetFilters}
                    className="text-sm text-green-600 hover:text-green-800 ml-2"
                  >
                    Reset all
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Items Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <Link href={`/items/${item.id}`}>
                    <div className="relative h-64 w-full">
                      <Image 
                        src={item.imageSrc} 
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                  
                  <div className="p-4">
                    <Link href={`/items/${item.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-green-600">{item.title}</h3>
                    </Link>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">{item.description}</p>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {item.category}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Size: {item.size}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {item.condition}
                      </span>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        By {item.uploader}
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        {item.pointsValue} points
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button 
                        href={`/items/${item.id}`}
                        variant="outline"
                        className="w-full"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or search terms.</p>
              <Button onClick={resetFilters} variant="outline">
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
}