import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
      validate: {
        validator: function(v) {
          return v.length > 0;
        },
        message: 'At least one image is required',
      },
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Tops',
        'Bottoms',
        'Dresses',
        'Outerwear',
        'Footwear',
        'Accessories',
        'Activewear',
        'Formal',
        'Other'
      ],
    },
    size: {
      type: String,
      required: [true, 'Size is required'],
    },
    condition: {
      type: String,
      required: [true, 'Condition is required'],
      enum: ['Like New', 'Excellent', 'Good', 'Fair'],
    },
    pointsValue: {
      type: Number,
      required: [true, 'Points value is required'],
      min: [1, 'Points value must be at least 1'],
    },
    status: {
      type: String,
      enum: ['pending', 'available', 'swapping', 'swapped', 'redeemed', 'rejected', 'removed'],
      default: 'pending',
    },
    uploaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploader ID is required'],
    },
    redeemedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    redemptionDate: {
      type: Date,
      default: null,
    },
    approvedDate: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    rejectedDate: {
      type: Date,
      default: null,
    },
    removedDate: {
      type: Date,
      default: null,
    },
    removedReason: {
      type: String,
      default: '',
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

// Create a text index for search functionality
ItemSchema.index({ title: 'text', description: 'text', tags: 'text' });

export default mongoose.models.Item || mongoose.model('Item', ItemSchema);