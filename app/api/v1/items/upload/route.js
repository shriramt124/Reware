import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/mongoose';
import Item from '../../../../../models/Item';
import { authenticate, unauthorizedResponse } from '../../../../../lib/auth';

// POST handler for uploading a new item
export async function POST(request) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Authenticate the user
    const { authenticated, user, error } = await authenticate(request);
    
    if (!authenticated) {
      return unauthorizedResponse(error);
    }

    const { title, description, category, size, condition, images, tags } = await request.json();

    // Validate required fields
    if (!title || !description || !category || !size || !condition || !images || images.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate points value based on condition
    const pointsValue = calculatePointsValue(condition);
    
    // Create a new item in the database
    const newItem = new Item({
      title,
      description,
      images,
      category,
      size,
      condition,
      pointsValue,
      status: 'pending', // Items start as pending until approved by admin
      uploaderId: user._id,
      tags: tags || [],
    });
    
    // Save the item to the database
    await newItem.save();
    
    // Format the response
    const formattedItem = {
      id: newItem._id,
      title: newItem.title,
      description: newItem.description,
      images: newItem.images,
      category: newItem.category,
      size: newItem.size,
      condition: newItem.condition,
      pointsValue: newItem.pointsValue,
      status: newItem.status,
      createdAt: newItem.createdAt,
      uploader: {
        id: user._id,
        name: user.name,
        avatar: user.avatar || '/placeholder-image.svg',
      },
      tags: newItem.tags,
    };

    return NextResponse.json({
      success: true,
      message: 'Item uploaded successfully and pending approval',
      data: formattedItem,
    });
  } catch (error) {
    console.error('Error uploading item:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to calculate points value based on condition
function calculatePointsValue(condition) {
  switch (condition) {
    case 'Like New':
      return 90; // 90 points
    case 'Excellent':
      return 70; // 70 points
    case 'Good':
      return 50; // 50 points
    case 'Fair':
      return 30; // 30 points
    default:
      return 30; // Default value
  }
}