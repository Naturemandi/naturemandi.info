import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    items: [orderItemSchema],

    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      alternatePhone: { type: String }, // optional
      nearby: { type: String }, // optional
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    appliedCoupon: {
      type: String,
      default: '',
    },
    discount: {
      type: Number,
      default: 0,
    },

    paymentMethod: {
      type: String,
      enum: ['COD', 'Online'],
      default: 'COD',
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,

    paymentId: { type: String }, // Razorpay payment ID
    razorpayOrderId: { type: String }, // Razorpay Order ID (optional)
    paymentSignature: { type: String }, // For security verification (optional)

    invoiceUrl: { type: String }, // for downloadable invoice
    notes: { type: String }, // admin notes or extra info

    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,

    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },

    courier: { type: String },
    trackingId: { type: String },
    estimatedDeliveryDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
