import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '../../../../../../lib/mongoose';
import Item from '../../../../../../models/Item';
import Report from '../../../../../../models/Report';
import { authenticate, unauthorizedResponse } from '../../../../../../lib/auth';

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
    const { reason, details } = await request.json();
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid item ID' },
        { status: 400 }
      );
    }
    
    // Validate reason
    if (!reason) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Report reason is required',
          errors: [
            { field: 'reason', message: 'Please provide a reason for reporting this item' }
          ] 
        }, 
        { status: 400 }
      );
    }
    
    // Check if the item exists
    const item = await Item.findById(id);
    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Item not found' },
        { status: 404 }
      );
    }
    
    // Check if user is reporting their own item
    if (item.uploaderId.toString() === user._id.toString()) {
      return NextResponse.json(
        { success: false, message: 'You cannot report your own item' },
        { status: 400 }
      );
    }
    
    // Check if item is already reported by this user
    const existingReport = await Report.findOne({
      itemId: id,
      reporterId: user._id
    });
    
    if (existingReport) {
      return NextResponse.json(
        { success: false, message: 'You have already reported this item' },
        { status: 400 }
      );
    }
    
    // Create new report
    const newReport = new Report({
      itemId: id,
      reporterId: user._id,
      reason,
      details: details || '',
      status: 'pending'
    });
    
    // Save the report to the database
    await newReport.save();
    
    return NextResponse.json(
      {
        success: true,
        message: 'Item reported successfully'
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Report item error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}