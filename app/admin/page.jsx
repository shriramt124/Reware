'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Button from '../../components/ui/Button';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { FiUser, FiAlertCircle, FiCheckCircle, FiXCircle, FiShield, FiUsers, FiRefreshCw, FiDollarSign, FiPackage, FiCreditCard } from 'react-icons/fi';

export default function AdminDashboardPage() {
  const { user, getToken } = useAuth();
  
  // State for pending and reported items
  const [pendingItems, setPendingItems] = useState([]);
  const [reportedItems, setReportedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch pending items and reported items
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get auth token
        const token = await getToken();
        
        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }
        
        // Fetch pending items (items with status 'pending')
        const pendingResponse = await fetch('/api/v1/items?status=pending', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Fetch reported items
        const reportsResponse = await fetch('/api/v1/admin/reports', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!pendingResponse.ok) {
          throw new Error(`Failed to fetch pending items: ${pendingResponse.statusText}`);
        }
        
        if (!reportsResponse.ok) {
          throw new Error(`Failed to fetch reported items: ${reportsResponse.statusText}`);
        }
        
        const pendingData = await pendingResponse.json();
        const reportsData = await reportsResponse.json();
        
        // Format pending items
        const formattedPendingItems = pendingData.data?.items?.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          imageSrc: item.images?.[0] || '/placeholder-image.svg',
          category: item.category,
          size: item.size,
          condition: item.condition,
          uploader: item.uploader?.name || 'Unknown User',
          uploadDate: new Date(item.uploadedDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        })) || [];
        
        // Format reported items
        const formattedReportedItems = reportsData.data?.reports?.map(report => ({
          id: report._id,
          itemId: report.itemId?._id,
          title: report.itemId?.title || 'Unknown Item',
          description: report.itemId?.description || '',
          imageSrc: report.itemId?.images?.[0] || '/placeholder-image.svg',
          category: report.itemId?.category || 'Unknown',
          reportReason: report.reason,
          reportedBy: report.reporterId?.username || 'Anonymous User',
          reportDate: new Date(report.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        })) || [];
        
        setPendingItems(formattedPendingItems);
        setReportedItems(formattedReportedItems);
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdminData();
  }, [getToken]);

  // State for active tab
  const [activeTab, setActiveTab] = useState('pending');

  // State for selected items (for bulk actions)
  const [selectedItems, setSelectedItems] = useState([]);
  
  // State for action status
  const [actionStatus, setActionStatus] = useState({ loading: false, message: '', type: '' });

  // Handle item selection
  const toggleItemSelection = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  // Handle select all
  const toggleSelectAll = () => {
    if (activeTab === 'pending') {
      if (selectedItems.length === pendingItems.length) {
        setSelectedItems([]);
      } else {
        setSelectedItems(pendingItems.map(item => item.id));
      }
    } else {
      if (selectedItems.length === reportedItems.length) {
        setSelectedItems([]);
      } else {
        setSelectedItems(reportedItems.map(item => item.id));
      }
    }
  };

  // Handle approve item
  const handleApprove = async (itemId) => {
    try {
      setActionStatus({ loading: true, message: 'Approving item...', type: 'info' });
      const token = await getToken();
      
      const response = await fetch(`/api/v1/admin/items/${itemId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to approve item: ${response.statusText}`);
      }
      
      // Remove the approved item from the pending list
      setPendingItems(pendingItems.filter(item => item.id !== itemId));
      setActionStatus({ loading: false, message: 'Item approved successfully', type: 'success' });
      
      // Clear status message after 3 seconds
      setTimeout(() => setActionStatus({ loading: false, message: '', type: '' }), 3000);
    } catch (err) {
      console.error('Error approving item:', err);
      setActionStatus({ loading: false, message: err.message, type: 'error' });
    }
  };

  // Handle reject item
  const handleReject = async (itemId) => {
    try {
      setActionStatus({ loading: true, message: 'Rejecting item...', type: 'info' });
      const token = await getToken();
      
      const response = await fetch(`/api/v1/admin/items/${itemId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to reject item: ${response.statusText}`);
      }
      
      // Remove the rejected item from the pending list
      setPendingItems(pendingItems.filter(item => item.id !== itemId));
      setActionStatus({ loading: false, message: 'Item rejected successfully', type: 'success' });
      
      // Clear status message after 3 seconds
      setTimeout(() => setActionStatus({ loading: false, message: '', type: '' }), 3000);
    } catch (err) {
      console.error('Error rejecting item:', err);
      setActionStatus({ loading: false, message: err.message, type: 'error' });
    }
  };

  // Handle bulk approve
  const handleBulkApprove = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      setActionStatus({ loading: true, message: `Approving ${selectedItems.length} items...`, type: 'info' });
      const token = await getToken();
      
      const response = await fetch('/api/v1/admin/items/approve', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ itemIds: selectedItems })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to approve items: ${response.statusText}`);
      }
      
      // Remove the approved items from the pending list
      setPendingItems(pendingItems.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      setActionStatus({ loading: false, message: `${selectedItems.length} items approved successfully`, type: 'success' });
      
      // Clear status message after 3 seconds
      setTimeout(() => setActionStatus({ loading: false, message: '', type: '' }), 3000);
    } catch (err) {
      console.error('Error approving items:', err);
      setActionStatus({ loading: false, message: err.message, type: 'error' });
    }
  };

  // Handle bulk reject
  const handleBulkReject = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      setActionStatus({ loading: true, message: `Rejecting ${selectedItems.length} items...`, type: 'info' });
      const token = await getToken();
      
      const response = await fetch('/api/v1/admin/items/reject', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ itemIds: selectedItems })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to reject items: ${response.statusText}`);
      }
      
      // Remove the rejected items from the pending list
      setPendingItems(pendingItems.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      setActionStatus({ loading: false, message: `${selectedItems.length} items rejected successfully`, type: 'success' });
      
      // Clear status message after 3 seconds
      setTimeout(() => setActionStatus({ loading: false, message: '', type: '' }), 3000);
    } catch (err) {
      console.error('Error rejecting items:', err);
      setActionStatus({ loading: false, message: err.message, type: 'error' });
    }
  };

  // Handle dismiss report
  const handleDismissReport = async (reportId) => {
    try {
      setActionStatus({ loading: true, message: 'Dismissing report...', type: 'info' });
      const token = await getToken();
      
      const response = await fetch('/api/v1/admin/reports', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          action: 'dismiss',
          reportIds: [reportId]
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to dismiss report: ${response.statusText}`);
      }
      
      // Remove the report from the list
      setReportedItems(reportedItems.filter(item => item.id !== reportId));
      setActionStatus({ loading: false, message: 'Report dismissed successfully', type: 'success' });
      
      // Clear status message after 3 seconds
      setTimeout(() => setActionStatus({ loading: false, message: '', type: '' }), 3000);
    } catch (err) {
      console.error('Error dismissing report:', err);
      setActionStatus({ loading: false, message: err.message, type: 'error' });
    }
  };

  // Handle remove item
  const handleRemoveItem = async (reportId) => {
    try {
      setActionStatus({ loading: true, message: 'Removing item...', type: 'info' });
      const token = await getToken();
      
      const response = await fetch('/api/v1/admin/reports', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          action: 'remove',
          reportIds: [reportId]
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to remove item: ${response.statusText}`);
      }
      
      // Remove the report from the list
      setReportedItems(reportedItems.filter(item => item.id !== reportId));
      setActionStatus({ loading: false, message: 'Item removed successfully', type: 'success' });
      
      // Clear status message after 3 seconds
      setTimeout(() => setActionStatus({ loading: false, message: '', type: '' }), 3000);
    } catch (err) {
      console.error('Error removing item:', err);
      setActionStatus({ loading: false, message: err.message, type: 'error' });
    }
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <Navbar />

      <main className="flex-1 py-10 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center">
                <div className="p-3 bg-indigo-100 rounded-full mr-4">
                  <FiShield className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-gray-600 mt-1">Manage platform content and users</p>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex items-center bg-white py-2 px-4 rounded-full shadow-sm">
                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full mr-2">
                  Admin
                </span>
                <span className="text-gray-600 font-medium">Welcome, {user?.name || 'Admin User'}</span>
              </div>
            </div>
          </div>
          
          {/* Status message */}
          {actionStatus.message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center ${actionStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : actionStatus.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
              {actionStatus.loading ? (
                <div className="mr-3 h-5 w-5 rounded-full border-2 border-current border-r-transparent animate-spin"></div>
              ) : actionStatus.type === 'success' ? (
                <FiCheckCircle className="mr-3 h-5 w-5" />
              ) : actionStatus.type === 'error' ? (
                <FiAlertCircle className="mr-3 h-5 w-5" />
              ) : (
                <FiRefreshCw className="mr-3 h-5 w-5" />
              )}
              {actionStatus.message}
            </div>
          )}
          
          {/* Loading state */}
          {loading && (
            <div className="bg-white p-12 rounded-xl shadow-sm text-center border border-gray-100 mb-8">
              <div className="inline-flex items-center justify-center p-4 mb-4">
                <div className="h-8 w-8 rounded-full border-4 border-indigo-500 border-r-transparent animate-spin"></div>
              </div>
              <p className="text-gray-600 font-medium">Loading admin data...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-8 flex items-center">
              <FiAlertCircle className="text-red-600 mr-3 h-5 w-5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Dashboard Tabs */}
          <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
            <nav className="flex">
              <button
                onClick={() => {
                  setActiveTab('pending');
                  setSelectedItems([]);
                }}
                className={`flex items-center justify-center ${activeTab === 'pending' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-500' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} flex-1 py-4 px-4 font-medium text-sm transition-all duration-200`}
              >
                <FiCheckCircle className="mr-2 h-5 w-5" />
                Pending Approval
                <span className="ml-2 bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full text-xs">
                  {pendingItems.length}
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('reported');
                  setSelectedItems([]);
                }}
                className={`flex items-center justify-center ${activeTab === 'reported' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-500' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} flex-1 py-4 px-4 font-medium text-sm transition-all duration-200`}
              >
                <FiAlertCircle className="mr-2 h-5 w-5" />
                Reported Items
                <span className="ml-2 bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full text-xs">
                  {reportedItems.length}
                </span>
              </button>
            </nav>
          </div>

          {/* Pending Approval Tab Content */}
          {activeTab === 'pending' && (
            <div>
              {pendingItems.length > 0 ? (
                <>
                  {/* Bulk Actions */}
                  {selectedItems.length > 0 && (
                    <div className="bg-indigo-50 p-4 rounded-xl mb-6 flex items-center justify-between shadow-sm border border-indigo-100">
                      <div>
                        <span className="text-indigo-700 font-medium flex items-center">
                          <FiCheckCircle className="mr-2 h-5 w-5 text-indigo-600" />
                          {selectedItems.length} items selected
                        </span>
                      </div>
                      <div className="flex space-x-3">
                        <Button
                          onClick={handleBulkApprove}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 transition-all duration-200 flex items-center"
                        >
                          <FiCheckCircle className="mr-2 h-4 w-4" />
                          Approve Selected
                        </Button>
                        <Button
                          onClick={handleBulkReject}
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50 transition-all duration-200 flex items-center"
                        >
                          <FiXCircle className="mr-2 h-4 w-4" />
                          Reject Selected
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Items Table */}
                  <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedItems.length === pendingItems.length && pendingItems.length > 0}
                                onChange={toggleSelectAll}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                            </div>
                          </th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Item
                          </th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Details
                          </th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Uploader
                          </th>
                          <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {pendingItems.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={selectedItems.includes(item.id)}
                                  onChange={() => toggleItemSelection(item.id)}
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-14 w-14 flex-shrink-0 mr-3 shadow-sm rounded-lg overflow-hidden">
                                  <Image
                                    src={item.imageSrc}
                                    alt={item.title}
                                    width={56}
                                    height={56}
                                    className="rounded-lg object-cover h-full w-full"
                                  />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{item.title}</div>
                                  <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col space-y-1">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {item.category}
                                </span>
                                <div className="text-sm text-gray-500 flex items-center space-x-2">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    Size: {item.size}
                                  </span>
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    {item.condition}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-500">
                                <FiUser className="text-gray-400 mr-2" />
                                {item.uploader}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <svg className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {item.uploadDate}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <Link
                                  href={`/items/${item.id}`}
                                  className="text-indigo-600 hover:text-indigo-900 flex items-center"
                                >
                                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  View
                                </Link>
                                <button
                                  onClick={() => handleApprove(item.id)}
                                  className="text-green-600 hover:text-green-900 flex items-center"
                                >
                                  <FiCheckCircle className="mr-1" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(item.id)}
                                  className="text-red-600 hover:text-red-900 flex items-center"
                                >
                                  <FiXCircle className="mr-1" />
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="bg-white p-8 rounded-xl shadow-md text-center border border-gray-100">
                  <div className="inline-flex items-center justify-center p-4 bg-indigo-50 rounded-full mb-4">
                    <FiCheckCircle className="h-8 w-8 text-indigo-600" />
                  </div>
                  <p className="text-gray-600 mb-4 font-medium">No items pending approval.</p>
                </div>
              )}
            </div>
          )}

          {/* Reported Items Tab Content */}
          {activeTab === 'reported' && (
            <div>
              {reportedItems.length > 0 ? (
                <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Report Reason
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reported By
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reportedItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-14 w-14 flex-shrink-0 mr-3 shadow-sm rounded-lg overflow-hidden">
                                <Image
                                  src={item.imageSrc}
                                  alt={item.title}
                                  width={56}
                                  height={56}
                                  className="rounded-lg object-cover h-full w-full"
                                />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{item.title}</div>
                                <div className="mt-1">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {item.category}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                              <FiAlertCircle className="mr-1 h-4 w-4" />
                              {item.reportReason}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-500">
                              <FiUser className="text-gray-400 mr-2" />
                              {item.reportedBy}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-500">
                              <svg className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {item.reportDate}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Link
                                href={`/items/${item.id}`}
                                className="text-indigo-600 hover:text-indigo-900 flex items-center"
                              >
                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View
                              </Link>
                              <button
                                onClick={() => handleDismissReport(item.id)}
                                className="text-green-600 hover:text-green-900 flex items-center"
                              >
                                <FiCheckCircle className="mr-1" />
                                Dismiss
                              </button>
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-red-600 hover:text-red-900 flex items-center"
                              >
                                <FiXCircle className="mr-1" />
                                Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-xl shadow-md text-center border border-gray-100">
                  <div className="inline-flex items-center justify-center p-4 bg-indigo-50 rounded-full mb-4">
                    <FiCheckCircle className="h-8 w-8 text-indigo-600" />
                  </div>
                  <p className="text-gray-600 mb-4 font-medium">No reported items.</p>
                </div>
              )}
            </div>
          )}

          {/* Admin Stats */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <svg className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Platform Statistics
            </h3>

            {loading ? (
              <div className="bg-white p-8 rounded-xl shadow-md text-center border border-gray-100">
                <div className="inline-flex items-center justify-center p-4 mb-4">
                  <div className="h-8 w-8 rounded-full border-4 border-indigo-500 border-r-transparent animate-spin"></div>
                </div>
                <p className="text-gray-600 font-medium">Loading statistics data...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden shadow-md rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="px-6 py-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-100 rounded-full p-4">
                        <FiPackage className="h-7 w-7 text-green-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Pending Items</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-bold text-gray-900">{pendingItems.length}</div>
                            <span className="ml-2 text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                              Awaiting Review
                            </span>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-2">
                    <div className="text-xs text-green-800 font-medium">{selectedItems.length} items selected for action</div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow-md rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="px-6 py-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-100 rounded-full p-4">
                        <FiUsers className="h-7 w-7 text-blue-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Reported Items</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-bold text-gray-900">{reportedItems.length}</div>
                            <span className="ml-2 text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                              Need Attention
                            </span>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-2">
                    <div className="text-xs text-blue-800 font-medium">Reported by users</div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow-md rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="px-6 py-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-yellow-100 rounded-full p-4">
                        <FiRefreshCw className="h-7 w-7 text-yellow-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Active Tab</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-bold text-gray-900">{activeTab === 'pending' ? 'Pending' : 'Reported'}</div>
                            <span className="ml-2 text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                              Current View
                            </span>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 px-6 py-2">
                    <div className="text-xs text-yellow-800 font-medium">Click tabs to switch views</div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow-md rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="px-6 py-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-purple-100 rounded-full p-4">
                        <FiDollarSign className="h-7 w-7 text-purple-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Action Status</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-bold text-gray-900">
                              {actionStatus.loading ? '...' : actionStatus.type === 'success' ? 'Success' : actionStatus.type === 'error' ? 'Error' : 'Ready'}
                            </div>
                            <span className="ml-2 text-xs font-medium text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                              {actionStatus.loading ? 'Processing' : actionStatus.type}
                            </span>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-2">
                    <div className="text-xs text-purple-800 font-medium">{actionStatus.message || 'No recent actions'}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </ProtectedRoute>
  );
}