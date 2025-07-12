import { NextResponse } from 'next/server';

// This would connect to your database in a real implementation
// For now, we'll simulate rejecting a swap request

// Mock database for swap requests
let swaps = [
  {
    id: 'swap_1',
    status: 'pending',
    requestDate: '2023-10-15T00:00:00.000Z',
    requestedItem: {
      id: 'item_1',
      title: 'Denim Jacket',
      image: '/placeholder-image.svg',
    },
    offeredItems: [
      {
        id: 'item_3',
        title: 'Winter Sweater',
        image: '/placeholder-image.svg',
      },
    ],
    requesterId: 'user_mock',
    ownerId: 'user_123',
  },
];

// Reject a swap request
export async function PUT(request, { params }) {
  try {
    // In a real app, you would verify the JWT token here
    // const token = request.headers.get('Authorization')?.split(' ')[1];
    // if (!token) return unauthorized response
    
    const id = params.id;
    
    // Find the swap by ID
    const swapIndex = swaps.findIndex(swap => swap.id === id);
    
    // If swap not found
    if (swapIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Swap request not found' },
        { status: 404 }
      );
    }
    
    const swap = swaps[swapIndex];
    
    // Check if user is the owner of the requested item or the requester
    if (swap.ownerId !== 'user_mock' && swap.requesterId !== 'user_mock') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized to reject this swap request' },
        { status: 403 }
      );
    }
    
    // Check if swap is in pending status
    if (swap.status !== 'pending') {
      return NextResponse.json(
        { success: false, message: `Cannot reject a swap that is already ${swap.status}` },
        { status: 400 }
      );
    }
    
    // Update swap status
    swap.status = 'rejected';
    swaps[swapIndex] = swap;
    
    return NextResponse.json(
      {
        success: true,
        message: 'Swap rejected successfully',
        data: {
          id: swap.id,
          status: swap.status
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Reject swap error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error while rejecting swap request' },
      { status: 500 }
    );
  }
}