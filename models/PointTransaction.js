import mongoose from 'mongoose';

const PointTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
    },
    type: {
      type: String,
      enum: ['upload', 'redeem', 'admin', 'swap', 'bonus'],
      required: [true, 'Transaction type is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    relatedItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      default: null,
    },
    relatedSwapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Swap',
      default: null,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    balanceAfter: {
      type: Number,
      required: [true, 'Balance after transaction is required'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.PointTransaction || mongoose.model('PointTransaction', PointTransactionSchema);