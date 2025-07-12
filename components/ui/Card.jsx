import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Card({ 
  title, 
  description, 
  imageSrc = '/placeholder-image.jpg', 
  imageAlt = 'Item image',
  href,
  footer,
  className = '',
  ...props 
}) {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden flex flex-col ${className}`}
      {...props}
    >
      <div className="relative h-48 w-full">
        <Image 
          src={imageSrc} 
          alt={imageAlt}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        {href ? (
          <Link href={href} className="hover:underline">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </Link>
        ) : (
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        )}
        
        {description && (
          <p className="mt-2 text-sm text-gray-600 flex-1">{description}</p>
        )}
        
        {footer && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}