import { NextResponse } from 'next/server';
import { generateToken } from '../../../../../lib/auth';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../../../lib/mongoose';
import User from '../../../../../models/User';
import jwt from 'jsonwebtoken';

// Get JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Please provide email and password'
        }, 
        { status: 400 }
      );
    }
    
    // Connect to database
    await dbConnect();
    
    // Find the user by email in the database
    // We need to explicitly select the password field as it's excluded by default in the model
    const user = await User.findOne({ email }).select('+password');
    
    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid credentials'
        }, 
        { status: 401 }
      );
    }

    // Compare passwords using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid credentials'
        }, 
        { status: 401 }
      );
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            points: user.points || 0,
            joinedDate: user.createdAt,
            role: user.role,
          },
          token,
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}