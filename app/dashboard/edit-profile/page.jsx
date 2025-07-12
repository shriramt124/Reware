'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { FiUser, FiMail, FiMapPin, FiCamera, FiSave, FiArrowLeft, FiInfo, FiBell, FiGlobe, FiTag, FiRefreshCw } from 'react-icons/fi';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    interests: [],
    newInterest: '',
    notifications: false,
    publicProfile: false,
    swapAlerts: false
  });

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        bio: user?.bio || '',
        location: user?.location || '',
        interests: user?.preferences?.categories || [],
        newInterest: '',
        notifications: user?.preferences?.notifications?.email || false,
        publicProfile: user?.preferences?.notifications?.publicProfile || false,
        swapAlerts: user?.preferences?.notifications?.swapRequests || false
      });
    }
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle adding a new interest
  const handleAddInterest = (e) => {
    e.preventDefault();
    if (formData.newInterest.trim() && !formData.interests.includes(formData.newInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, formData.newInterest.trim()],
        newInterest: ''
      });
    }
  };

  // Handle removing an interest
  const handleRemoveInterest = (interestToRemove) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(interest => interest !== interestToRemove)
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveSuccess(false);

    // Prepare data for API
    const profileData = {
      name: formData.name,
      bio: formData.bio,
      location: formData.location,
      preferences: {
        categories: formData.interests,
        notifications: {
          email: formData.notifications,
          publicProfile: formData.publicProfile,
          swapRequests: formData.swapAlerts
        }
      }
    };

    // Call the updateProfile function from AuthContext
    const result = await updateProfile(profileData);

    setIsLoading(false);

    if (result.success) {
      setSaveSuccess(true);

      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } else {
      // Handle error
      alert(result.message || 'Failed to update profile');
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 py-10 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <Link
              href="/dashboard"
              className="mr-4 text-gray-600 hover:text-green-600 transition-colors"
            >
              <FiArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          </div>

          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 flex flex-col items-center">
              <div className="relative group">
                <div className="relative h-36 w-36 rounded-full overflow-hidden border-4 border-white shadow-md">
                  <Image
                    src={user?.avatar || '/images/default-avatar.png'}
                    alt={user?.name || 'User profile'}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black bg-opacity-50 rounded-full h-36 w-36 flex items-center justify-center">
                    <button className="text-white p-2 rounded-full bg-green-600 hover:bg-green-700 transition-colors">
                      <FiCamera className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">Click to change profile picture</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {saveSuccess && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Profile updated successfully! Redirecting to dashboard...
                </div>
              )}

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FiUser className="mr-2 text-green-500" /> Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 shadow-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FiMail className="mr-2 text-green-500" /> Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiInfo className="mr-2 text-green-500" /> Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 shadow-sm"
                    placeholder="Tell us a bit about yourself"
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiMapPin className="mr-2 text-green-500" /> Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 shadow-sm"
                    placeholder="City, State"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <FiTag className="mr-2 text-green-500" /> Interests
                  </label>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.interests.map((interest, index) => (
                      <div
                        key={index}
                        className="bg-green-50 text-green-700 px-3 py-1 rounded-full flex items-center group"
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() => handleRemoveInterest(interest)}
                          className="ml-2 text-green-500 hover:text-green-700 focus:outline-none"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex">
                    <input
                      type="text"
                      id="newInterest"
                      name="newInterest"
                      value={formData.newInterest}
                      onChange={handleChange}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-green-500 focus:border-green-500 shadow-sm"
                      placeholder="Add a new interest"
                    />
                    <button
                      type="button"
                      onClick={handleAddInterest}
                      className="px-4 py-2 bg-green-600 text-white rounded-r-lg hover:bg-green-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <FiGlobe className="mr-2 text-green-500" /> Preferences
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        id="notifications"
                        name="notifications"
                        checked={formData.notifications}
                        onChange={handleChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="notifications" className="ml-3 flex items-center">
                        <FiBell className="text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">Receive email notifications</span>
                      </label>
                    </div>

                    <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        id="publicProfile"
                        name="publicProfile"
                        checked={formData.publicProfile}
                        onChange={handleChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="publicProfile" className="ml-3 flex items-center">
                        <FiGlobe className="text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">Make my profile public</span>
                      </label>
                    </div>

                    <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        id="swapAlerts"
                        name="swapAlerts"
                        checked={formData.swapAlerts}
                        onChange={handleChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="swapAlerts" className="ml-3 flex items-center">
                        <FiRefreshCw className="text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">Receive swap request alerts</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Link
                  href="/dashboard"
                  className="mr-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                >
                  <FiArrowLeft className="mr-2" /> Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}