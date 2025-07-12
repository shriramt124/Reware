import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/mongoose';
import Item from '../../../../../models/Item';
import { authenticate, unauthorizedResponse } from '../../../../../lib/auth';
import mongoose from 'mongoose';

// GET handler for retrieving a specific item by ID
export async function GET(request, { params }) {
  try {
    // Connect to the database
    await dbConnect();
    
    const { id } = params;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid item ID' },
        { status: 400 }
      );
    }

    // Find the item by ID and populate uploader details
    const item = await Item.findById(id).populate('uploaderId', 'name avatar');
    
    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Item not found' },
        { status: 404 }
      );
    }

    // Format the response
    const formattedItem = {
      id: item._id,
      title: item.title,
      description: item.description,
      images: item.images,
      category: item.category,
      size: item.size,
      condition: item.condition,
      pointsValue: item.pointsValue,
      status: item.status,
      createdAt: item.createdAt,
      uploader: {
        id: item.uploaderId._id,
        name: item.uploaderId.name,
        avatar: item.uploaderId.avatar || '/placeholder-image.svg',
      },
      tags: item.tags,
    };

    return NextResponse.json({
      success: true,
      data: formattedItem,
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT handler for updating an item
export async function PUT(request, { params }) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Authenticate the user
    const { authenticated, user, error } = await authenticate(request);
    
    if (!authenticated) {
      return unauthorizedResponse(error);
    }
    
    const { id } = params;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid item ID' },
        { status: 400 }
      );
    }
    
    // Find the item
    const item = await Item.findById(id);
    
    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Item not found' },
        { status: 404 }
      );
    }
    
    // Check if the user is the owner of the item
    if (item.uploaderId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { success: false, message: 'You are not authorized to update this item' },
        { status: 403 }
      );
    }
    
    // Check if the item is in a state that can be updated
    if (item.status !== 'pending' && item.status !== 'available') {
      return NextResponse.json(
        { success: false, message: `Item cannot be updated in '${item.status}' status` },
        { status: 400 }
      );
    }
    
    const { title, description, category, size, condition, tags } = await request.json();

    // Update the item
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      {
        title,
        description,
        category,
        size,
        condition,
        tags: tags || [],
        // Reset to pending if the item was already approved
        status: item.status === 'available' ? 'pending' : item.status,
      },
      { new: true }
    ).populate('uploaderId', 'name avatar');

    // Format the response
    const formattedItem = {
      id: updatedItem._id,
      title: updatedItem.title,
      description: updatedItem.description,
      images: updatedItem.images,
      category: updatedItem.category,
      size: updatedItem.size,
      condition: updatedItem.condition,
      pointsValue: updatedItem.pointsValue,
      status: updatedItem.status,
      createdAt: updatedItem.createdAt,
      uploader: {
        id: updatedItem.uploaderId._id,
        name: updatedItem.uploaderId.name,
        avatar: updatedItem.uploaderId.avatar || '/placeholder-image.svg',
      },
      tags: updatedItem.tags,
    };

    return NextResponse.json({
      success: true,
      message: 'Item updated successfully',
      data: formattedItem,
    });
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE handler for deleting an item
export async function DELETE(request, { params }) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Authenticate the user
    const { authenticated, user, error } = await authenticate(request);
    
    if (!authenticated) {
      return unauthorizedResponse(error);
    }
    
    const { id } = params;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid item ID' },
        { status: 400 }
      );
    }
    
    // Find the item
    const item = await Item.findById(id);
    
    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Item not found' },
        { status: 404 }
      );
    }
    
    // Check if the user is the owner of the item or an admin
    if (item.uploaderId.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'You are not authorized to delete this item' },
        { status: 403 }
      );
    }
    
    // Check if the item is in a state that can be deleted
    if (item.status !== 'pending' && item.status !== 'available' && item.status !== 'rejected') {
      return NextResponse.json(
        { success: false, message: `Item cannot be deleted in '${item.status}' status` },
        { status: 400 }
      );
    }
    
    // Update the item status to 'removed' instead of actually deleting it
    await Item.findByIdAndUpdate(id, {
      status: 'removed',
      removedDate: new Date(),
      removedReason: 'Deleted by user',
    });

    return NextResponse.json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}