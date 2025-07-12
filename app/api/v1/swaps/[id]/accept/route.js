import { NextResponse } from 'next/server';

// This would connect to your database in a real implementation
// For now, we'll simulate accepting a swap request

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

// Mock database for items
let items = [
  {
    id: 'item_1',
    title: 'Denim Jacket',
    status: 'available',
    uploaderId: 'user_123',
  },
  {
    id: 'item_3',
    title: 'Winter Sweater',
    status: 'available',
    uploaderId: 'user_mock',
  },
];

// Accept a swap request
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
    
    // Check if user is the owner of the requested item
    if (swap.ownerId !== 'user_mock') { // In a real app, this would be the authenticated user's ID
      return NextResponse.json(
        { success: false, message: 'Unauthorized to accept this swap request' },
        { status: 403 }
      );
    }
    
    // Check if swap is in pending status
    if (swap.status !== 'pending') {
      return NextResponse.json(
        { success: false, message: `Cannot accept a swap that is already ${swap.status}` },
        { status: 400 }
      );
    }
    
    // Update swap status
    swap.status = 'accepted';
    swaps[swapIndex] = swap;
    
    // In a real app, you would also update the status of the items involved
    // to mark them as being in an active swap
    const requestedItemIndex = items.findIndex(item => item.id === swap.requestedItem.id);
    if (requestedItemIndex !== -1) {
      items[requestedItemIndex].status = 'swapping';
    }
    
    swap.offeredItems.forEach(offeredItem => {
      const offeredItemIndex = items.findIndex(item => item.id === offeredItem.id);
      if (offeredItemIndex !== -1) {
        items[offeredItemIndex].status = 'swapping';
      }
    });
    
    return NextResponse.json(
      {
        success: true,
        message: 'Swap accepted successfully',
        data: {
          id: swap.id,
          status: swap.status
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Accept swap error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error while accepting swap request' },
      { status: 500 }
    );
  }
}