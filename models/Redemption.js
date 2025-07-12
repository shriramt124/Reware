import mongoose from 'mongoose';

const RedemptionSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: [true, 'Item ID is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    pointsSpent: {
      type: Number,
      required: [true, 'Points spent is required'],
      min: [1, 'Points spent must be at least 1'],
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PointTransaction',
      required: [true, 'Transaction ID is required'],
    },
    status: {
      type: String,
      enum: ['completed', 'cancelled', 'refunded'],
      default: 'completed',
    },
    cancellationReason: {
      type: String,
      default: '',
    },
    cancelledDate: {
      type: Date,
      default: null,
    },
    refundTransactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PointTransaction',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Redemption || mongoose.model('Redemption', RedemptionSchema);