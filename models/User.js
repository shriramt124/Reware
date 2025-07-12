import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't return password in queries by default
    },
    avatar: {
      type: String,
      default: '/placeholder-image.svg',
    },
    bio: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    points: {
      type: Number,
      default: 0,
    },
    successfulSwaps: {
      type: Number,
      default: 0,
    },
    preferences: {
      categories: [String],
      sizes: [String],
      notifications: {
        email: { type: Boolean, default: true },
        swapRequests: { type: Boolean, default: true },
        itemApproved: { type: Boolean, default: true },
        pointsEarned: { type: Boolean, default: true },
      },
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// Only compile the model if it hasn't been compiled before
export default mongoose.models.User || mongoose.model('User', UserSchema);