'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FiUser, FiShield, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Get authentication state from context
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between bg-white shadow-sm">
      <Link href="/" className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-green-600">ReWear</h1>
      </Link>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors">
          Home
        </Link>
        <Link href="/browse" className="text-gray-700 hover:text-green-600 transition-colors">
          Browse Items
        </Link>
        {isAuthenticated && (
          <Link href="/dashboard" className="text-gray-700 hover:text-green-600 transition-colors">
            Dashboard
          </Link>
        )}
        {isAdmin() && (
          <Link href="/admin" className="text-gray-700 hover:text-green-600 transition-colors flex items-center">
            <FiShield className="mr-1" /> Admin
          </Link>
        )}
      </nav>
      
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden text-gray-700 hover:text-green-600 transition-colors"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
      </button>
      
      {/* Desktop Auth Buttons */}
      <div className="hidden md:flex items-center gap-4">
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className="flex items-center text-gray-700 hover:text-green-600 transition-colors"
            >
              <FiUser className="mr-1" /> My Account
            </Link>
            <button
              onClick={logout}
              className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
            >
              <FiLogOut className="mr-1" /> Logout
            </button>
          </div>
        ) : (
          <>
            <Link href="/auth/login" className="text-gray-700 hover:text-green-600 transition-colors">
              Login
            </Link>
            <Link 
              href="/auth/register" 
              className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md z-50 p-4">
          <nav className="flex flex-col space-y-4">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-green-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/browse" 
              className="text-gray-700 hover:text-green-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Items
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-gray-700 hover:text-green-600 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {isAdmin() && (
                  <Link 
                    href="/admin" 
                    className="text-gray-700 hover:text-green-600 transition-colors py-2 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiShield className="mr-1" /> Admin Panel
                  </Link>
                )}
              </>
            )}
            {!isAuthenticated ? (
              <>
                <Link 
                  href="/auth/login" 
                  className="text-gray-700 hover:text-green-600 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  href="/auth/register" 
                  className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors inline-block text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/dashboard" 
                  className="flex items-center text-gray-700 hover:text-green-600 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiUser className="mr-1" /> My Account
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center text-gray-700 hover:text-red-600 transition-colors py-2 w-full text-left"
                >
                  <FiLogOut className="mr-1" /> Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}