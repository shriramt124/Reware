import { NextResponse } from 'next/server';

// This would connect to your database in a real implementation
// For now, we'll simulate swap requests

// Mock database for items (simplified version)
let items = [
  {
    id: 'item_1',
    title: 'Denim Jacket',
    description: 'Lightly worn denim jacket, perfect for fall weather',
    images: ['/placeholder-image.svg'],
    status: 'available',
    uploaderId: 'user_123',
  },
  {
    id: 'item_2',
    title: 'Summer Dress',
    description: 'Floral pattern summer dress, worn only twice',
    images: ['/placeholder-image.svg'],
    status: 'available',
    uploaderId: 'user_456',
  },
  {
    id: 'item_3',
    title: 'Winter Sweater',
    description: 'Warm wool sweater in excellent condition',
    images: ['/placeholder-image.svg'],
    status: 'available',
    uploaderId: 'user_mock', // Current user's item
  },
  {
    id: 'item_4',
    title: 'Running Shoes',
    description: 'Lightly used running shoes, size 9',
    images: ['/placeholder-image.svg'],
    status: 'available',
    uploaderId: 'user_mock', // Current user's item
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

// Create a new swap request
export async function POST(request) {
  try {
    // In a real app, you would verify the JWT token here
    // const token = request.headers.get('Authorization')?.split(' ')[1];
    // if (!token) return unauthorized response
    
    const body = await request.json();
    const { itemId, offeredItemIds } = body;
    
    // Validate required fields
    if (!itemId || !offeredItemIds || !Array.isArray(offeredItemIds) || offeredItemIds.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields',
          errors: [
            ...(!itemId ? [{ field: 'itemId', message: 'Item ID is required' }] : []),
            ...(!offeredItemIds || !Array.isArray(offeredItemIds) || offeredItemIds.length === 0 ? 
              [{ field: 'offeredItemIds', message: 'At least one offered item is required' }] : [])
          ] 
        }, 
        { status: 400 }
      );
    }
    
    // Find the requested item
    const requestedItem = items.find(item => item.id === itemId);
    
    // If item not found
    if (!requestedItem) {
      return NextResponse.json(
        { success: false, message: 'Requested item not found' },
        { status: 404 }
      );
    }
    
    // Check if item is available
    if (requestedItem.status !== 'available') {
      return NextResponse.json(
        { success: false, message: 'Requested item is not available for swapping' },
        { status: 400 }
      );
    }
    
    // Check if user is trying to swap their own item
    if (requestedItem.uploaderId === 'user_mock') { // In a real app, this would be the authenticated user's ID
      return NextResponse.json(
        { success: false, message: 'You cannot swap your own item' },
        { status: 400 }
      );
    }
    
    // Find the offered items
    const offeredItems = items.filter(item => offeredItemIds.includes(item.id));
    
    // Check if all offered items exist
    if (offeredItems.length !== offeredItemIds.length) {
      return NextResponse.json(
        { success: false, message: 'One or more offered items not found' },
        { status: 404 }
      );
    }
    
    // Check if all offered items belong to the user
    const invalidItems = offeredItems.filter(item => item.uploaderId !== 'user_mock');
    if (invalidItems.length > 0) {
      return NextResponse.json(
        { success: false, message: 'You can only offer items that you own' },
        { status: 400 }
      );
    }
    
    // Check if all offered items are available
    const unavailableItems = offeredItems.filter(item => item.status !== 'available');
    if (unavailableItems.length > 0) {
      return NextResponse.json(
        { success: false, message: 'One or more offered items are not available for swapping' },
        { status: 400 }
      );
    }
    
    // Check if a swap request already exists for this item from this user
    const existingSwap = swaps.find(swap => 
      swap.requestedItem.id === itemId && 
      swap.requesterId === 'user_mock' && 
      swap.status === 'pending'
    );
    
    if (existingSwap) {
      return NextResponse.json(
        { success: false, message: 'You already have a pending swap request for this item' },
        { status: 400 }
      );
    }
    
    // Create new swap request
    const newSwap = {
      id: 'swap_' + Math.random().toString(36).substr(2, 9),
      status: 'pending',
      requestDate: new Date().toISOString(),
      requestedItem: {
        id: requestedItem.id,
        title: requestedItem.title,
        image: requestedItem.images[0],
      },
      offeredItems: offeredItems.map(item => ({
        id: item.id,
        title: item.title,
        image: item.images[0],
      })),
      requesterId: 'user_mock', // In a real app, this would be the authenticated user's ID
      ownerId: requestedItem.uploaderId,
    };
    
    // In a real app, you would save this to your database
    // For now, we'll add it to our mock database
    swaps.push(newSwap);
    
    return NextResponse.json(
      {
        success: true,
        message: 'Swap request sent successfully',
        data: newSwap
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Create swap error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error while creating swap request' },
      { status: 500 }
    );
  }
}

// Get user's swap requests
export async function GET(request) {
  try {
    // In a real app, you would verify the JWT token here
    // const token = request.headers.get('Authorization')?.split(' ')[1];
    // if (!token) return unauthorized response
    
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const type = searchParams.get('type') || 'all'; // sent, received, all
    const status = searchParams.get('status'); // pending, accepted, rejected, completed
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Filter swaps based on type
    let filteredSwaps = [];
    
    if (type === 'sent') {
      filteredSwaps = swaps.filter(swap => swap.requesterId === 'user_mock');
    } else if (type === 'received') {
      filteredSwaps = swaps.filter(swap => swap.ownerId === 'user_mock');
    } else { // 'all'
      filteredSwaps = swaps.filter(swap => 
        swap.requesterId === 'user_mock' || swap.ownerId === 'user_mock'
      );
    }
    
    // Filter by status if provided
    if (status) {
      filteredSwaps = filteredSwaps.filter(swap => swap.status === status);
    }
    
    // Sort by request date (newest first)
    filteredSwaps.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
    
    // Add user information to swaps
    const swapsWithUsers = filteredSwaps.map(swap => {
      const requester = users.find(user => user.id === swap.requesterId);
      const owner = users.find(user => user.id === swap.ownerId);
      
      return {
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
    });
    
    // Calculate pagination
    const total = swapsWithUsers.length;
    const pages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    // Get swaps for current page
    const paginatedSwaps = swapsWithUsers.slice(startIndex, endIndex);
    
    return NextResponse.json(
      {
        success: true,
        data: {
          swaps: paginatedSwaps,
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
    console.error('Get swaps error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error while fetching swap requests' },
      { status: 500 }
    );
  }
}