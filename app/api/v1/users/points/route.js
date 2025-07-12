import { NextResponse } from 'next/server';

// This would connect to your database in a real implementation
// For now, we'll simulate user points management

// Mock database for users
let users = [
  {
    id: 'user_123',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    points: 100,
    avatar: '/placeholder-image.svg',
  },
  {
    id: 'user_mock',
    name: 'Current User',
    email: 'current@example.com',
    points: 75,
    avatar: '/placeholder-image.svg',
  },
];

// Mock database for point transactions
let pointTransactions = [
  {
    id: 'transaction_1',
    userId: 'user_mock',
    amount: 25,
    type: 'earned',
    reason: 'Item listed',
    itemId: 'item_5',
    date: '2023-10-01T00:00:00.000Z',
  },
  {
    id: 'transaction_2',
    userId: 'user_mock',
    amount: 50,
    type: 'spent',
    reason: 'Item redeemed',
    itemId: 'item_4',
    date: '2023-10-05T00:00:00.000Z',
  },
];

// Get user points and transaction history
export async function GET(request) {
  try {
    // In a real app, you would verify the JWT token here
    // const token = request.headers.get('Authorization')?.split(' ')[1];
    // if (!token) return unauthorized response
    
    // Get the current user ID from the authenticated user
    const currentUserId = 'user_mock';
    
    // Find the user
    const user = users.find(user => user.id === currentUserId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get the user's point transactions
    const transactions = pointTransactions.filter(transaction => transaction.userId === currentUserId);
    
    // Sort transactions by date (newest first)
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Calculate points statistics
    const totalEarned = transactions
      .filter(t => t.type === 'earned')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalSpent = transactions
      .filter(t => t.type === 'spent')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return NextResponse.json(
      {
        success: true,
        data: {
          currentPoints: user.points,
          statistics: {
            totalEarned,
            totalSpent
          },
          transactions: transactions.map(t => ({
            id: t.id,
            amount: t.amount,
            type: t.type,
            reason: t.reason,
            itemId: t.itemId,
            date: t.date
          }))
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Get points error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error while retrieving points information' },
      { status: 500 }
    );
  }
}

// Add points to a user (admin only)
export async function POST(request) {
  try {
    // In a real app, you would verify the JWT token here and check admin role
    // const token = request.headers.get('Authorization')?.split(' ')[1];
    // if (!token || !isAdmin) return unauthorized response
    
    const data = await request.json();
    
    // Validate input
    if (!data.userId || !data.amount || !data.reason) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: userId, amount, and reason are required' },
        { status: 400 }
      );
    }
    
    if (typeof data.amount !== 'number' || data.amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Amount must be a positive number' },
        { status: 400 }
      );
    }
    
    // Find the user
    const userIndex = users.findIndex(user => user.id === data.userId);
    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Add points to the user
    users[userIndex].points += data.amount;
    
    // Create a transaction record
    const transaction = {
      id: `transaction_${Date.now()}`,
      userId: data.userId,
      amount: data.amount,
      type: 'earned',
      reason: data.reason,
      itemId: data.itemId || null,
      date: new Date().toISOString(),
    };
    
    pointTransactions.push(transaction);
    
    return NextResponse.json(
      {
        success: true,
        message: 'Points added successfully',
        data: {
          userId: data.userId,
          pointsAdded: data.amount,
          newTotal: users[userIndex].points,
          transaction: {
            id: transaction.id,
            type: transaction.type,
            amount: transaction.amount,
            reason: transaction.reason,
            date: transaction.date
          }
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Add points error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error while adding points' },
      { status: 500 }
    );
  }
}