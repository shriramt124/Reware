import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: [true, 'Item ID is required'],
    },
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reporter ID is required'],
    },
    reason: {
      type: String,
      required: [true, 'Report reason is required'],
      enum: [
        'Inappropriate content',
        'Counterfeit item',
        'Misleading description',
        'Wrong category',
        'Other'
      ],
    },
    details: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'dismissed', 'removed'],
      default: 'pending',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedDate: {
      type: Date,
      default: null,
    },
    reviewNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate reports from the same user for the same item
ReportSchema.index({ itemId: 1, reporterId: 1 }, { unique: true });

export default mongoose.models.Report || mongoose.model('Report', ReportSchema);