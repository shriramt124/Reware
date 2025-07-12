import { NextResponse } from 'next/server';

// This would connect to your database in a real implementation
// For now, we'll simulate completing a swap request

// Mock database for swap requests
let swaps = [
  {
    id: 'swap_1',
    status: 'accepted',
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
    status: 'swapping',
    uploaderId: 'user_123',
  },
  {
    id: 'item_3',
    title: 'Winter Sweater',
    status: 'swapping',
    uploaderId: 'user_mock',
  },
];

// Mock database for users
let users = [
  {
    id: 'user_123',
    name: 'Alex Johnson',
    avatar: '/placeholder-image.svg',
    successfulSwaps: 15,
  },
  {
    id: 'user_mock',
    name: 'Current User',
    avatar: '/placeholder-image.svg',
    successfulSwaps: 5,
  },
];

// Complete a swap request
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
    
    // Check if user is involved in the swap
    if (swap.ownerId !== 'user_mock' && swap.requesterId !== 'user_mock') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized to complete this swap request' },
        { status: 403 }
      );
    }
    
    // Check if swap is in accepted status
    if (swap.status !== 'accepted') {
      return NextResponse.json(
        { success: false, message: `Cannot complete a swap that is ${swap.status}` },
        { status: 400 }
      );
    }
    
    // Update swap status
    swap.status = 'completed';
    swap.completedDate = new Date().toISOString();
    swaps[swapIndex] = swap;
    
    // In a real app, you would update the ownership of the items
    // and mark them as swapped
    
    // Update requested item ownership and status
    const requestedItemIndex = items.findIndex(item => item.id === swap.requestedItem.id);
    if (requestedItemIndex !== -1) {
      items[requestedItemIndex].status = 'swapped';
      items[requestedItemIndex].uploaderId = swap.requesterId; // Transfer ownership
    }
    
    // Update offered items ownership and status
    swap.offeredItems.forEach(offeredItem => {
      const offeredItemIndex = items.findIndex(item => item.id === offeredItem.id);
      if (offeredItemIndex !== -1) {
        items[offeredItemIndex].status = 'swapped';
        items[offeredItemIndex].uploaderId = swap.ownerId; // Transfer ownership
      }
    });
    
    // Update users' successful swaps count
    const requesterIndex = users.findIndex(user => user.id === swap.requesterId);
    if (requesterIndex !== -1) {
      users[requesterIndex].successfulSwaps += 1;
    }
    
    const ownerIndex = users.findIndex(user => user.id === swap.ownerId);
    if (ownerIndex !== -1) {
      users[ownerIndex].successfulSwaps += 1;
    }
    
    return NextResponse.json(
      {
        success: true,
        message: 'Swap completed successfully',
        data: {
          id: swap.id,
          status: swap.status
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Complete swap error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error while completing swap request' },
      { status: 500 }
    );
  }
}