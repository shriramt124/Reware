import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongoose';
import Item from '../../../../models/Item';
import User from '../../../../models/User';
import { authenticate, unauthorizedResponse } from '../../../../lib/auth';

// Create a new item
export async function POST(request) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Authenticate the user
    const { authenticated, user, error } = await authenticate(request);
    
    if (!authenticated) {
      return unauthorizedResponse(error);
    }
    
    const body = await request.json();
    const { title, description, category, size, condition, tags, images } = body;
    
    // Validate required fields
    if (!title || !description || !category || !size || !condition) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields',
          errors: [
            ...(!title ? [{ field: 'title', message: 'Title is required' }] : []),
            ...(!description ? [{ field: 'description', message: 'Description is required' }] : []),
            ...(!category ? [{ field: 'category', message: 'Category is required' }] : []),
            ...(!size ? [{ field: 'size', message: 'Size is required' }] : []),
            ...(!condition ? [{ field: 'condition', message: 'Condition is required' }] : [])
          ] 
        }, 
        { status: 400 }
      );
    }
    
    // Validate images
    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'At least one image is required',
          errors: [
            { field: 'images', message: 'Please upload at least one image' }
          ] 
        }, 
        { status: 400 }
      );
    }
    
    // Create new item in MongoDB
    const newItem = await Item.create({
      title,
      description,
      category,
      size,
      condition,
      tags: tags || [],
      images,
      pointsValue: 0, // Will be set by admin during approval
      status: 'pending', // All new items start as pending
      uploaderId: user._id, // Now we use the authenticated user's ID
    });
    
    // Format the response
    const formattedItem = {
      id: newItem._id,
      title: newItem.title,
      description: newItem.description,
      category: newItem.category,
      size: newItem.size,
      condition: newItem.condition,
      tags: newItem.tags,
      images: newItem.images,
      pointsValue: newItem.pointsValue,
      status: newItem.status,
      uploadedDate: newItem.createdAt,
      uploaderId: user._id,
      uploader: {
        id: user._id,
        name: user.name,
        avatar: user.avatar || '/placeholder-image.svg'
      }
    };
    
    return NextResponse.json(
      {
        success: true,
        message: 'Item created successfully and pending approval',
        data: formattedItem
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Create item error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error while creating item' },
      { status: 500 }
    );
  }
}

// Get all items with filtering, pagination, and sorting
export async function GET(request) {
  try {
    // Connect to the database
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const category = searchParams.get('category');
    const size = searchParams.get('size');
    const condition = searchParams.get('condition');
    const tagsParam = searchParams.get('tags');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || 'newest';
    
    // Build the filter object for MongoDB
    const filter = { status: 'available' }; // Only show available items
    
    if (category) filter.category = category;
    if (size) filter.size = size;
    if (condition) filter.condition = condition;
    
    // Parse tags if provided and add to filter
    const tags = tagsParam ? tagsParam.split(',') : [];
    if (tags.length > 0) {
      filter.tags = { $in: tags };
    }
    
    // Add text search if provided
    if (search) {
      // Using MongoDB text search (requires text index on relevant fields)
      filter.$text = { $search: search };
    }
    
    // Build the sort object for MongoDB
    let sortObj = {};
    switch (sort) {
      case 'newest':
        sortObj = { createdAt: -1 };
        break;
      case 'oldest':
        sortObj = { createdAt: 1 };
        break;
      case 'points_high':
        sortObj = { pointsValue: -1 };
        break;
      case 'points_low':
        sortObj = { pointsValue: 1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Query the database
    const items = await Item.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .populate('uploaderId', 'name avatar');
    
    // Get total count for pagination
    const total = await Item.countDocuments(filter);
    const pages = Math.ceil(total / limit);
    
    // Format the response
    const formattedItems = items.map(item => ({
      id: item._id,
      title: item.title,
      description: item.description,
      category: item.category,
      size: item.size,
      condition: item.condition,
      tags: item.tags,
      images: item.images,
      pointsValue: item.pointsValue,
      status: item.status,
      uploadedDate: item.createdAt,
      uploaderId: item.uploaderId._id,
      uploader: {
        id: item.uploaderId._id,
        name: item.uploaderId.name,
        avatar: item.uploaderId.avatar || '/placeholder-image.svg'
      }
    }));
    
    return NextResponse.json(
      {
        success: true,
        data: {
          items: formattedItems,
          pagination: {
            total,
            page,
            limit,
            pages
          }
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Get items error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error while fetching items' },
      { status: 500 }
    );
  }
}