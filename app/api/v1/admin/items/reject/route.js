import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { dbConnect } from '@/lib/mongodb';
import Item from '@/models/Item';
import { authenticate } from '@/lib/auth';

// Helper function for unauthorized response
const unauthorizedResponse = (message = 'Unauthorized access') => {
  return NextResponse.json({ success: false, message }, { status: 401 });
};


// Reject items (admin only)
export async function POST(request) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Authenticate user and verify admin role
    const user = await authenticate(request);
    if (!user) {
      return unauthorizedResponse('Authentication required');
    }
    
    // Check if user has admin role
    if (user.role !== 'admin') {
      return unauthorizedResponse('Admin privileges required');
    }
    
    const data = await request.json();
    
    // Validate input
    if (!data.itemIds || !Array.isArray(data.itemIds) || data.itemIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Missing or invalid itemIds. Expected a non-empty array.' },
        { status: 400 }
      );
    }
    
    if (!data.reason) {
      return NextResponse.json(
        { success: false, message: 'Rejection reason is required' },
        { status: 400 }
      );
    }
    
    const rejectedItems = [];
    const notFoundItems = [];
    const alreadyProcessedItems = [];
    const invalidIds = [];
    
    // Process each item
    for (const itemId of data.itemIds) {
      // Validate MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(itemId)) {
        invalidIds.push(itemId);
        continue;
      }
      
      try {
        // Find the item in MongoDB
        const item = await Item.findById(itemId);
        
        // If item not found
        if (!item) {
          notFoundItems.push(itemId);
          continue;
        }
        
        // Check if item is not in pending status
        if (item.status !== 'pending') {
          alreadyProcessedItems.push({
            id: itemId,
            currentStatus: item.status
          });
          continue;
        }
        
        // Reject the item
        item.status = 'rejected';
        item.rejectionReason = data.reason;
        item.rejectedDate = new Date();
        
        // Save the updated item to MongoDB
        await item.save();
        
        // Add to rejected items list
        rejectedItems.push({
          id: itemId,
          title: item.title,
          uploaderId: item.uploader.toString(),
          reason: data.reason
        });
      } catch (error) {
        console.error(`Error processing item ${itemId}:`, error);
        notFoundItems.push(itemId);
      }
    }
    // Prepare response
    const response = {
      success: true,
      message: `Processed ${data.itemIds.length} items`,
      data: {
        rejected: rejectedItems,
        notFound: notFoundItems,
        alreadyProcessed: alreadyProcessedItems,
        invalidIds: invalidIds,
        summary: {
          total: data.itemIds.length,
          rejected: rejectedItems.length,
          notFound: notFoundItems.length,
          alreadyProcessed: alreadyProcessedItems.length,
          invalidIds: invalidIds.length
        }
      }
    };
    
    return NextResponse.json(response, { status: 200 });
    
  } catch (error) {
    console.error('Reject items error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error while rejecting items' },
      { status: 500 }
    );
  }
}