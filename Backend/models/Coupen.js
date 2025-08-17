import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  discount: {
    type: Number,
    required: true, // percentage (e.g., 10 for 10%)
    min: 1,
    max: 100,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  usageLimit: {
    type: Number,
    default: 1, // How many times the coupon can be used
  },
  usedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
}, { timestamps: true });

export default mongoose.model('Coupon', couponSchema);
