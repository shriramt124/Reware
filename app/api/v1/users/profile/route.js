import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../../../lib/mongoose';
import User from '../../../../../models/User';

// Get JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Get user profile
export async function GET(request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Connect to database
    await dbConnect();
    
    // Find the user in the database
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Return user profile without sensitive information
    return NextResponse.json(
      {
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || '/placeholder-image.svg',
          bio: user.bio || '',
          location: user.location || '',
          joinedDate: user.createdAt,
          points: user.points,
          successfulSwaps: user.successfulSwaps,
          preferences: user.preferences,
          role: user.role
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error while retrieving profile' },
      { status: 500 }
    );
  }
}

// Update user profile
export async function PUT(request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    
    // Connect to database
    await dbConnect();
    
    // Find the user in the database
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Update allowed fields
    const allowedFields = ['name', 'bio', 'location', 'avatar'];
    let updatedFields = [];
    
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        user[field] = data[field];
        updatedFields.push(field);
      }
    }
    
    // Update preferences if provided
    if (data.preferences) {
      // Initialize preferences if they don't exist
      if (!user.preferences) {
        user.preferences = {
          categories: [],
          sizes: [],
          notifications: {
            email: true,
            swapRequests: true,
            itemApproved: true,
            pointsEarned: true,
          },
        };
      }
      
      // Update categories if provided
      if (data.preferences.categories) {
        user.preferences.categories = data.preferences.categories;
        updatedFields.push('preferences.categories');
      }
      
      // Update sizes if provided
      if (data.preferences.sizes) {
        user.preferences.sizes = data.preferences.sizes;
        updatedFields.push('preferences.sizes');
      }
      
      // Update notification preferences if provided
      if (data.preferences.notifications) {
        // Initialize notifications if they don't exist
        if (!user.preferences.notifications) {
          user.preferences.notifications = {
            email: true,
            swapRequests: true,
            itemApproved: true,
            pointsEarned: true,
          };
        }
        
        for (const [key, value] of Object.entries(data.preferences.notifications)) {
          if (user.preferences.notifications[key] !== undefined) {
            user.preferences.notifications[key] = value;
            updatedFields.push(`preferences.notifications.${key}`);
          }
        }
      }
    }
    
    // Save the updated user
    await user.save();
    
    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Profile updated successfully',
        data: {
          updatedFields,
          profile: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            location: user.location,
            preferences: user.preferences
          }
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error while updating profile' },
      { status: 500 }
    );
  }
}