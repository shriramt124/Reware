import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '../../../../../../lib/mongoose';
import Item from '../../../../../../models/Item';
import User from '../../../../../../models/User';
import Redemption from '../../../../../../models/Redemption';
import PointTransaction from '../../../../../../models/PointTransaction';
import { authenticate, unauthorizedResponse } from '../../../../../../lib/auth';

// Redeem an item with points
export async function POST(request, { params }) {
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
    
    // Find the item by ID
    const item = await Item.findById(id);
    
    // If item not found
    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Item not found' },
        { status: 404 }
      );
    }
    
    // Check if item is available
    if (item.status !== 'available') {
      return NextResponse.json(
        { success: false, message: `Item is not available for redemption (status: ${item.status})` },
        { status: 400 }
      );
    }
    
    // Check if user is not the uploader
    if (item.uploaderId.toString() === user._id.toString()) {
      return NextResponse.json(
        { success: false, message: 'You cannot redeem your own item' },
        { status: 400 }
      );
    }
    
    // Check if user has enough points
    if (user.points < item.pointsValue) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Not enough points to redeem this item', 
          data: {
            userPoints: user.points,
            requiredPoints: item.pointsValue,
            shortfall: item.pointsValue - user.points
          }
        },
        { status: 400 }
      );
    }
    
    // Find the item uploader
    const uploader = await User.findById(item.uploaderId);
    if (!uploader) {
      return NextResponse.json(
        { success: false, message: 'Item uploader not found' },
        { status: 500 }
      );
    }
    
    // Start a MongoDB session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // 1. Create redemption record
      const redemption = new Redemption({
        itemId: item._id,
        userId: user._id,
        pointsSpent: item.pointsValue,
        status: 'completed'
      });
      
      await redemption.save({ session });
      
      // 2. Deduct points from the user
      const userDeductTransaction = new PointTransaction({
        userId: user._id,
        amount: -item.pointsValue,
        type: 'redeem',
        description: `Redeemed item: ${item.title}`,
        relatedItemId: item._id,
        balance: user.points - item.pointsValue
      });
      
      await userDeductTransaction.save({ session });
      
      // Update user's points
      await User.findByIdAndUpdate(
        user._id,
        { $inc: { points: -item.pointsValue } },
        { session }
      );
      
      // 3. Add points to the uploader
      const uploaderAddTransaction = new PointTransaction({
        userId: uploader._id,
        amount: item.pointsValue,
        type: 'swap',
        description: `Item redeemed: ${item.title}`,
        relatedItemId: item._id,
        balance: uploader.points + item.pointsValue
      });
      
      await uploaderAddTransaction.save({ session });
      
      // Update uploader's points
      await User.findByIdAndUpdate(
        uploader._id,
        { $inc: { points: item.pointsValue } },
        { session }
      );
      
      // 4. Update item status
      item.status = 'redeemed';
      item.redeemedBy = user._id;
      item.redemptionDate = new Date();
      
      await item.save({ session });
      
      // Commit the transaction
      await session.commitTransaction();
      session.endSession();
      
      // Get updated user for response
      const updatedUser = await User.findById(user._id);
      
      return NextResponse.json(
        {
          success: true,
          message: 'Item redeemed successfully',
          data: {
            redemptionId: redemption._id,
            item: {
              id: item._id,
              title: item.title,
              status: item.status
            },
            pointsSpent: item.pointsValue,
            remainingPoints: updatedUser.points
          }
        },
        { status: 200 }
      );
    } catch (transactionError) {
      // Abort transaction on error
      await session.abortTransaction();
      session.endSession();
      throw transactionError;
    }
    
  } catch (error) {
    console.error('Redeem item error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}