import { NextResponse } from 'next/server';

// This would connect to your database in a real implementation
// For now, we'll simulate swap request operations

// Mock database for swap requests (same as in the main swaps route)
let swaps = [
  {
    id: 'swap_1',
    status: 'pending',
    requestDate: '2023-10-15T00:00:00.000Z',
    requestedItem: {
      id: 'item_1',
      title: 'Denim Jacket',
      image: '/placeholder-image.svg',
      description: 'Lightly worn denim jacket, perfect for fall weather',
      category: 'Outerwear',
      size: 'M',
      condition: 'Good',
    },
    offeredItems: [
      {
        id: 'item_3',
        title: 'Winter Sweater',
        image: '/placeholder-image.svg',
        description: 'Warm wool sweater in excellent condition',
        category: 'Tops',
        size: 'L',
        condition: 'Excellent',
      },
    ],
    requesterId: 'user_mock',
    ownerId: 'user_123',
    requester: {
      id: 'user_mock',
      name: 'Current User',
      avatar: '/placeholder-image.svg',
    },
    owner: {
      id: 'user_123',
      name: 'Alex Johnson',
      avatar: '/placeholder-image.svg',
    },
  },
];

// Mock database for users
let users = [
  {
    id: 'user_123',
    name: 'Alex Johnson',
    avatar: '/placeholder-image.svg',
  },
  {
    id: 'user_456',
    name: 'Maria Garcia',
    avatar: '/placeholder-image.svg',
  },
  {
    id: 'user_mock',
    name: 'Current User',
    avatar: '/placeholder-image.svg',
  },
];

// Get swap by ID
export async function GET(request, { params }) {
  try {
    // In a real app, you would verify the JWT token here
    // const token = request.headers.get('Authorization')?.split(' ')[1];
    // if (!token) return unauthorized response
    
    const id = params.id;
    
    // Find the swap by ID
    const swap = swaps.find(swap => swap.id === id);
    
    // If swap not found
    if (!swap) {
      return NextResponse.json(
        { success: false, message: 'Swap request not found' },
        { status: 404 }
      );
    }
    
    // Check if user is involved in the swap
    if (swap.requesterId !== 'user_mock' && swap.ownerId !== 'user_mock') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized to view this swap request' },
        { status: 403 }
      );
    }
    
    // Add user information to swap
    const requester = users.find(user => user.id === swap.requesterId);
    const owner = users.find(user => user.id === swap.ownerId);
    
    const swapWithUsers = {
      ...swap,
      requester: requester ? {
        id: requester.id,
        name: requester.name,
        avatar: requester.avatar,
      } : null,
      owner: owner ? {
        id: owner.id,
        name: owner.name,
        avatar: owner.avatar,
      } : null,
    };
    
    return NextResponse.json(
      {
        success: true,
        data: swapWithUsers
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Get swap error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error while fetching swap request' },
      { status: 500 }
    );
  }
}