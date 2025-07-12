import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { dbConnect } from '../../../../../lib/mongoose';
import User from '../../../../../models/User';
import Item from '../../../../../models/Item';
import Swap from '../../../../../models/Swap';

// Get JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Get user dashboard data
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
    
    // Get the current user ID from the token
    const currentUserId = decoded.id;
    
    // Find the user in the database
    const user = await User.findById(currentUserId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get user's items
    const userItems = await Item.find({ uploaderId: currentUserId });
    
    // Get items redeemed by the user
    const redeemedItems = await Item.find({ redeemedBy: currentUserId }).populate('uploaderId', 'name');
    
    // Get user's swaps
    const userSwaps = await Swap.find({
      $or: [
        { requesterId: currentUserId },
        { ownerId: currentUserId }
      ]
    })
    .populate('requestedItemId', 'title images')
    .populate('offeredItemId', 'title images')
    .populate('requesterId', 'name')
    .populate('ownerId', 'name');
    
    // Calculate statistics
    const itemStats = {
      total: userItems.length,
      available: userItems.filter(item => item.status === 'available').length,
      pending: userItems.filter(item => item.status === 'pending').length,
      swapped: userItems.filter(item => item.status === 'swapped').length,
      redeemed: userItems.filter(item => item.status === 'redeemed').length,
    };
    
    const swapStats = {
      total: userSwaps.length,
      pending: userSwaps.filter(swap => swap.status === 'pending').length,
      accepted: userSwaps.filter(swap => swap.status === 'accepted').length,
      completed: userSwaps.filter(swap => swap.status === 'completed').length,
      rejected: userSwaps.filter(swap => swap.status === 'rejected').length,
    };
    
    // Format the swaps data for the response
    const formattedActiveSwaps = userSwaps
      .filter(swap => swap.status === 'pending' || swap.status === 'accepted')
      .map(swap => ({
        id: swap._id,
        status: swap.status,
        requestDate: swap.createdAt,
        isRequester: swap.requesterId._id.toString() === currentUserId,
        requestedItem: {
          id: swap.requestedItemId._id,
          title: swap.requestedItemId.title,
          image: swap.requestedItemId.images[0],
          uploaderId: swap.ownerId._id,
        },
        offeredItems: [{
          id: swap.offeredItemId._id,
          title: swap.offeredItemId.title,
          image: swap.offeredItemId.images[0],
          uploaderId: swap.requesterId._id,
        }],
        otherParty: swap.requesterId._id.toString() === currentUserId
          ? { id: swap.ownerId._id, name: swap.ownerId.name }
          : { id: swap.requesterId._id, name: swap.requesterId.name },
      }));
    
    const formattedCompletedSwaps = userSwaps
      .filter(swap => swap.status === 'completed' || swap.status === 'rejected')
      .map(swap => ({
        id: swap._id,
        status: swap.status,
        requestDate: swap.createdAt,
        completedDate: swap.completedDate || swap.rejectedDate,
        isRequester: swap.requesterId._id.toString() === currentUserId,
        requestedItem: {
          id: swap.requestedItemId._id,
          title: swap.requestedItemId.title,
          image: swap.requestedItemId.images[0],
          uploaderId: swap.ownerId._id,
        },
        offeredItems: [{
          id: swap.offeredItemId._id,
          title: swap.offeredItemId.title,
          image: swap.offeredItemId.images[0],
          uploaderId: swap.requesterId._id,
        }],
        otherParty: swap.requesterId._id.toString() === currentUserId
          ? { id: swap.ownerId._id, name: swap.ownerId.name }
          : { id: swap.requesterId._id, name: swap.requesterId.name },
      }));
    
    // Format the redeemed items data for the response
    const formattedRedeemedItems = redeemedItems.map(item => ({
      id: item._id,
      title: item.title,
      image: item.images[0],
      category: item.category,
      size: item.size,
      condition: item.condition,
      pointsValue: item.pointsValue,
      redemptionDate: item.redemptionDate,
      originalUploader: { 
        id: item.uploaderId._id,
        name: item.uploaderId.name
      },
    }));
    
    // Return dashboard data
    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.name,
            avatar: user.avatar || '/placeholder-image.svg',
            points: user.points || 0,
            successfulSwaps: user.successfulSwaps || 0,
            joinedDate: user.createdAt,
          },
          items: {
            stats: itemStats,
            listings: userItems.map(item => ({
              id: item._id,
              title: item.title,
              image: item.images[0],
              category: item.category,
              size: item.size,
              condition: item.condition,
              pointsValue: item.pointsValue,
              status: item.status,
              uploadDate: item.createdAt,
            })),
          },
          swaps: {
            stats: swapStats,
            active: formattedActiveSwaps,
            completed: formattedCompletedSwaps,
          },
          redeemed: formattedRedeemedItems,
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Get dashboard error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error while retrieving dashboard data' },
      { status: 500 }
    );
  }
}