'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AlertCircle, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Button from '../../components/ui/Button';

export default function BrowsePage() {
  // State for items data
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  
  // Available filter options
  const categories = ['Outerwear', 'Dresses', 'Tops', 'Bottoms', 'Shoes', 'Accessories'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '6', '7', '8', '9', '10', '11', '12'];
  const conditions = ['Like New', 'Excellent', 'Good', 'Fair'];
  
  // Fetch items from API
  const fetchItems = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (categoryFilter) params.append('category', categoryFilter);
      if (sizeFilter) params.append('size', sizeFilter);
      if (conditionFilter) params.append('condition', conditionFilter);
      params.append('page', pagination.page);
      params.append('limit', pagination.limit);
      
      // Make API call
      const response = await fetch(`/api/v1/items?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setItems(data.data.items);
        setPagination(data.data.pagination);
      } else {
        throw new Error(data.message || 'Failed to fetch items');
      }
    } catch (err) {
      console.error('Error fetching items:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch items when filters change
  useEffect(() => {
    fetchItems();
  }, [searchTerm, categoryFilter, sizeFilter, conditionFilter, pagination.page, pagination.limit]);
  
  // Reset pagination when filters change
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [searchTerm, categoryFilter, sizeFilter, conditionFilter]);
  
  // No need to filter items as the API does that for us
  const filteredItems = items;
  
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
          
          {/* Loading state */}
          {loading && (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <RefreshCw className="h-12 w-12 text-green-500 animate-spin" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Loading items...</h3>
            </div>
          )}
          
          {/* Error state */}
           {error && !loading && (
             <div className="bg-white p-8 rounded-lg shadow-md text-center border border-red-200">
               <div className="flex justify-center mb-4">
                 <AlertCircle className="h-12 w-12 text-red-500" />
               </div>
               <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading items</h3>
               <p className="text-red-600 mb-4">{error}</p>
               <Button onClick={fetchItems} variant="outline">
                 Try Again
               </Button>
             </div>
           )}
          
          {/* Items Grid */}
          {!loading && !error && filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <Link href={`/items/${item.id}`}>
                    <div className="relative h-64 w-full">
                      <Image 
                        src={item.images && item.images.length > 0 ? item.images[0] : '/placeholder-image.svg'} 
                        alt={item.title || 'Item image'}
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
                        By {item.uploader?.name || 'Unknown'}
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
          ) : !loading && !error ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or search terms.</p>
              <Button onClick={resetFilters} variant="outline">
                Reset Filters
              </Button>
            </div>
          ) : null}
           
           {/* Pagination */}
           {!loading && !error && filteredItems.length > 0 && pagination.pages > 1 && (
             <div className="mt-8 flex justify-center">
               <div className="flex space-x-2">
                 <Button 
                   variant="outline" 
                   onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))} 
                   disabled={pagination.page <= 1}
                 >
                   <ChevronLeft className="h-4 w-4 mr-2" />
                   Previous
                 </Button>
                 
                 <div className="flex items-center px-4 text-sm text-gray-600">
                   Page {pagination.page} of {pagination.pages}
                 </div>
                 
                 <Button 
                   variant="outline" 
                   onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))} 
                   disabled={pagination.page >= pagination.pages}
                 >
                   Next
                   <ChevronRight className="h-4 w-4 ml-2" />
                 </Button>
               </div>
             </div>
           )}
          </div>
        </main>
      
      <Footer />
    </>
  );
}