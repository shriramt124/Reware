import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { dbConnect } from '@/lib/mongodb';
import Report from '@/models/Report';
import Item from '@/models/Item';
import { authenticate } from '@/lib/auth';

// Helper function for unauthorized response
const unauthorizedResponse = (message = 'Unauthorized access') => {
  return NextResponse.json({ success: false, message }, { status: 401 });
};

// Get all reported items (admin only)
export async function GET(request) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Authenticate user and verify admin role
    const user = await authenticate(request);
    if (!user) {
      return unauthorizedResponse('Authentication required');
    }
    
    // Check if user has admin role
    if (user.role !== 'admin') {
      return unauthorizedResponse('Admin privileges required');
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }
    
    // Get reports from MongoDB with populated references
    const reports = await Report.find(query)
      .populate({
        path: 'itemId',
        select: 'title images status uploader',
        populate: {
          path: 'uploader',
          select: 'username email'
        }
      })
      .populate('reporterId', 'username email')
      .populate('reviewedBy', 'username email')
      .sort({ createdAt: -1 }); // Sort by creation date (newest first)
    
    // Count reports by status
    const pendingCount = await Report.countDocuments({ status: 'pending' });
    const dismissedCount = await Report.countDocuments({ status: 'dismissed' });
    const removedCount = await Report.countDocuments({ status: 'removed' });
    
    return NextResponse.json(
      {
        success: true,
        data: {
          reports,
          total: reports.length,
          pending: pendingCount,
          dismissed: dismissedCount,
          removed: removedCount
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Get reported items error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error while retrieving reported items' },
      { status: 500 }
    );
  }
}

// Dismiss reports (admin only)
export async function POST(request) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Authenticate user and verify admin role
    const user = await authenticate(request);
    if (!user) {
      return unauthorizedResponse('Authentication required');
    }
    
    // Check if user has admin role
    if (user.role !== 'admin') {
      return unauthorizedResponse('Admin privileges required');
    }
    
    const data = await request.json();
    
    // Validate input
    if (!data.action) {
      return NextResponse.json(
        { success: false, message: 'Action is required (dismiss or remove)' },
        { status: 400 }
      );
    }
    
    if (!data.reportIds || !Array.isArray(data.reportIds) || data.reportIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Missing or invalid reportIds. Expected a non-empty array.' },
        { status: 400 }
      );
    }
    
    // Check if action is valid
    if (data.action !== 'dismiss' && data.action !== 'remove') {
      return NextResponse.json(
        { success: false, message: 'Invalid action. Must be either "dismiss" or "remove".' },
        { status: 400 }
      );
    }
    
    const processedReports = [];
    const notFoundReports = [];
    const alreadyProcessedReports = [];
    const invalidIds = [];
    
    // Process each report
    for (const reportId of data.reportIds) {
      // Validate MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(reportId)) {
        invalidIds.push(reportId);
        continue;
      }
      
      try {
        // Find the report in MongoDB
        const report = await Report.findById(reportId);
        
        // If report not found
        if (!report) {
          notFoundReports.push(reportId);
          continue;
        }
        
        // Check if report is already processed
        if (report.status !== 'pending') {
          alreadyProcessedReports.push({
            id: reportId,
            currentStatus: report.status
          });
          continue;
        }
        
        if (data.action === 'dismiss') {
          // Dismiss the report
          report.status = 'dismissed';
          report.reviewedBy = user._id;
          report.reviewedDate = new Date();
          report.reviewNotes = data.notes || 'Dismissed by admin';
          
          // Save the updated report
          await report.save();
          
          processedReports.push({
            id: reportId,
            itemId: report.itemId.toString(),
            action: 'dismissed'
          });
        } else if (data.action === 'remove') {
          // Start a MongoDB transaction
          const session = await mongoose.startSession();
          session.startTransaction();
          
          try {
            // Update the report
            report.status = 'removed';
            report.reviewedBy = user._id;
            report.reviewedDate = new Date();
            report.reviewNotes = data.notes || 'Item removed due to report';
            
            // Save the updated report
            await report.save({ session });
            
            // Find and update the item
            const item = await Item.findById(report.itemId);
            if (item) {
              item.status = 'removed';
              item.removedDate = new Date();
              item.removedReason = 'Removed due to report: ' + report.reason;
              item.removedBy = user._id;
              
              // Save the updated item
              await item.save({ session });
            }
            
            // Commit the transaction
            await session.commitTransaction();
            session.endSession();
            
            processedReports.push({
              id: reportId,
              itemId: report.itemId.toString(),
              action: 'removed'
            });
          } catch (error) {
            // Abort the transaction on error
            await session.abortTransaction();
            session.endSession();
            console.error('Transaction error:', error);
            throw error;
          }
        }
      } catch (error) {
        console.error(`Error processing report ${reportId}:`, error);
        notFoundReports.push(reportId);
      }
    }
    
    // Prepare response
    const response = {
      success: true,
      message: `Processed ${data.reportIds.length} reports`,
      data: {
        processed: processedReports,
        notFound: notFoundReports,
        alreadyProcessed: alreadyProcessedReports,
        invalidIds: invalidIds,
        summary: {
          total: data.reportIds.length,
          processed: processedReports.length,
          notFound: notFoundReports.length,
          alreadyProcessed: alreadyProcessedReports.length,
          invalidIds: invalidIds.length
        }
      }
    };
    
    return NextResponse.json(response, { status: 200 });
    
  } catch (error) {
    console.error('Process reports error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error while processing reports' },
      { status: 500 }
    );
  }
}