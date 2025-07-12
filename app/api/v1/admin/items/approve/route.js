import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '../../../../../lib/mongoose';
import Item from '../../../../../models/Item';
import User from '../../../../../models/User';
import PointTransaction from '../../../../../models/PointTransaction';
import { authenticate, unauthorizedResponse, isAdmin, forbiddenResponse } from '../../../../../lib/auth';

// Approve items (admin only)
export async function POST(request) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Authenticate the user and check admin role
    const { authenticated, user, error } = await authenticate(request);
    
    if (!authenticated) {
      return unauthorizedResponse(error);
    }
    
    // Check if user is admin
    if (!isAdmin(user)) {
      return forbiddenResponse('Admin access required');
    }
    
    const data = await request.json();
    
    // Validate input
    if (!data.itemIds || !Array.isArray(data.itemIds) || data.itemIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Missing or invalid itemIds. Expected a non-empty array.' },
        { status: 400 }
      );
    }
    
    const approvedItems = [];
    const notFoundItems = [];
    const alreadyApprovedItems = [];
    const invalidIds = [];
    
    // Validate all IDs are valid MongoDB ObjectIds
    const validItemIds = data.itemIds.filter(id => {
      if (mongoose.Types.ObjectId.isValid(id)) {
        return true;
      } else {
        invalidIds.push(id);
        return false;
      }
    });
    
    // Start a MongoDB session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Process each item
      for (const itemId of validItemIds) {
        // Find the item
        const item = await Item.findById(itemId).session(session);
        
        // If item not found
        if (!item) {
          notFoundItems.push(itemId);
          continue;
        }
        
        // Check if item is already approved
        if (item.status !== 'pending') {
          alreadyApprovedItems.push({
            id: itemId,
            currentStatus: item.status
          });
          continue;
        }
        
        // Approve the item
        item.status = 'available';
        item.approvedDate = new Date();
        await item.save({ session });
        
        // Find the uploader
        const uploader = await User.findById(item.uploaderId).session(session);
        
        if (uploader) {
          // Points reward based on item condition
          let pointsReward = 0;
          switch (item.condition) {
            case 'Like New':
              pointsReward = 15;
              break;
            case 'Excellent':
              pointsReward = 10;
              break;
            case 'Good':
              pointsReward = 5;
              break;
            default:
              pointsReward = 3;
          }
          
          // Create a transaction record
          const transaction = new PointTransaction({
            userId: uploader._id,
            amount: pointsReward,
            type: 'upload',
            description: 'Item approved',
            relatedItemId: item._id,
            adminId: user._id,
            balance: uploader.points + pointsReward
          });
          
          await transaction.save({ session });
          
          // Update uploader's points
          await User.findByIdAndUpdate(
            uploader._id,
            { $inc: { points: pointsReward } },
            { session }
          );
          
          // Add transaction to the approved item info
          approvedItems.push({
            id: item._id.toString(),
            title: item.title,
            uploaderId: uploader._id.toString(),
            pointsRewarded: pointsReward
          });
        } else {
          // If uploader not found, still mark as approved but without points
          approvedItems.push({
            id: item._id.toString(),
            title: item.title,
            uploaderId: item.uploaderId.toString(),
            pointsRewarded: 0
          });
        }
      }
      
      // Commit the transaction
      await session.commitTransaction();
      session.endSession();
      
      // Prepare response
      const response = {
        success: true,
        message: `Processed ${data.itemIds.length} items`,
        data: {
          approved: approvedItems,
          notFound: notFoundItems,
          alreadyProcessed: alreadyApprovedItems,
          invalidIds: invalidIds,
          summary: {
            total: data.itemIds.length,
            approved: approvedItems.length,
            notFound: notFoundItems.length,
            alreadyProcessed: alreadyApprovedItems.length,
            invalidIds: invalidIds.length
          }
        }
      };
      
      return NextResponse.json(response, { status: 200 });
    } catch (transactionError) {
      // Abort transaction on error
      await session.abortTransaction();
      session.endSession();
      throw transactionError;
    }
    
  } catch (error) {
    console.error('Approve items error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}