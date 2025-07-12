import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import User from '../models/User';

// Get JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Authentication middleware
export const authenticate = async (req) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { authenticated: false, error: 'Unauthorized - No token provided' };
    }
    
    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return { authenticated: false, error: 'Unauthorized - Invalid token' };
    }
    
    // Find user by ID
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return { authenticated: false, error: 'Unauthorized - User not found' };
    }
    
    // Return authenticated user
    return { authenticated: true, user };
  } catch (error) {
    console.error('Authentication error:', error);
    return { authenticated: false, error: 'Internal server error' };
  }
};

// Check if user is admin
export const isAdmin = async (req) => {
  const { authenticated, user, error } = await authenticate(req);
  
  if (!authenticated) {
    return { authorized: false, error };
  }
  
  if (user.role !== 'admin') {
    return { authorized: false, error: 'Forbidden - Admin access required' };
  }
  
  return { authorized: true, user };
};

// Unauthorized response
export const unauthorizedResponse = (message = 'Unauthorized') => {
  return NextResponse.json(
    { success: false, message },
    { status: 401 }
  );
};

// Forbidden response
export const forbiddenResponse = (message = 'Forbidden') => {
  return NextResponse.json(
    { success: false, message },
    { status: 403 }
  );
};