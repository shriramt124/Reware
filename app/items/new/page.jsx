'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

export default function AddItemPage() {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    size: '',
    condition: '',
    tags: '',
  });
  
  // Image upload state
  const [images, setImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  
  // Form validation state
  const [errors, setErrors] = useState({});
  
  // Available options for select fields
  const categories = ['Outerwear', 'Dresses', 'Tops', 'Bottoms', 'Shoes', 'Accessories'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '6', '7', '8', '9', '10', '11', '12'];
  const conditions = ['Like New', 'Excellent', 'Good', 'Fair'];
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
  // Handle image upload
  const handleImageUpload = (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files);
    
    // Limit to 5 images
    if (images.length + files.length > 5) {
      setErrors({
        ...errors,
        images: 'You can upload a maximum of 5 images',
      });
      return;
    }
    
    // Create preview URLs for the images
    const newImagePreviewUrls = files.map(file => URL.createObjectURL(file));
    
    setImages([...images, ...files]);
    setImagePreviewUrls([...imagePreviewUrls, ...newImagePreviewUrls]);
    
    // Clear image error if it exists
    if (errors.images) {
      setErrors({
        ...errors,
        images: '',
      });
    }
  };
  
  // Remove an image
  const removeImage = (index) => {
    const newImages = [...images];
    const newImagePreviewUrls = [...imagePreviewUrls];
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newImagePreviewUrls[index]);
    
    newImages.splice(index, 1);
    newImagePreviewUrls.splice(index, 1);
    
    setImages(newImages);
    setImagePreviewUrls(newImagePreviewUrls);
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.size) {
      newErrors.size = 'Size is required';
    }
    
    if (!formData.condition) {
      newErrors.condition = 'Condition is required';
    }
    
    if (images.length === 0) {
      newErrors.images = 'At least one image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, this would upload the images and create the item
      console.log('Form data:', formData);
      console.log('Images:', images);
      
      // Mock successful submission
      alert('Item added successfully!');
      router.push('/dashboard');
    }
  };
  
  return (
    <>
      <Navbar />
      
      <main className="flex-1 py-10 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Item</h1>
          
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg overflow-hidden">
            {/* Image Upload Section */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Item Images</h2>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Upload up to 5 images of your item. The first image will be the main image.</p>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative h-32 w-32 rounded-lg overflow-hidden border border-gray-200">
                      <Image 
                        src={url} 
                        alt={`Item preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center hover:bg-red-600 focus:outline-none"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  
                  {images.length < 5 && (
                    <label className="h-32 w-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
                      <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className="mt-2 text-sm text-gray-500">Add Image</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        multiple
                      />
                    </label>
                  )}
                </div>
                
                {errors.images && (
                  <p className="text-red-500 text-sm mt-1">{errors.images}</p>
                )}
              </div>
            </div>
            
            {/* Item Details Section */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Item Details</h2>
              
              <div className="space-y-6">
                {/* Title */}
                <Input
                  label="Title"
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g., Denim Jacket"
                  value={formData.title}
                  onChange={handleInputChange}
                  error={errors.title}
                />
                
                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Describe your item, including details about fabric, fit, and any notable features or minor flaws"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                </div>
                
                {/* Category, Size, Condition */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                    )}
                  </div>
                  
                  {/* Size */}
                  <div>
                    <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                      Size
                    </label>
                    <select
                      id="size"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${errors.size ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    >
                      <option value="">Select a size</option>
                      {sizes.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                    {errors.size && (
                      <p className="text-red-500 text-sm mt-1">{errors.size}</p>
                    )}
                  </div>
                  
                  {/* Condition */}
                  <div>
                    <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                      Condition
                    </label>
                    <select
                      id="condition"
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${errors.condition ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    >
                      <option value="">Select condition</option>
                      {conditions.map((condition) => (
                        <option key={condition} value={condition}>{condition}</option>
                      ))}
                    </select>
                    {errors.condition && (
                      <p className="text-red-500 text-sm mt-1">{errors.condition}</p>
                    )}
                  </div>
                </div>
                
                {/* Tags */}
                <Input
                  label="Tags (comma separated)"
                  id="tags"
                  name="tags"
                  type="text"
                  placeholder="e.g., denim, casual, blue, fall"
                  value={formData.tags}
                  onChange={handleInputChange}
                  error={errors.tags}
                />
                
                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <Button type="submit">
                    List Item
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </>
  );
}