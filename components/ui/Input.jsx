import React from 'react';

export default function Input({
  label,
  id,
  type = 'text',
  placeholder,
  error,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        className={`
          w-full px-4 py-2 rounded-md border 
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'} 
          focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors
          ${className}
        `}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}