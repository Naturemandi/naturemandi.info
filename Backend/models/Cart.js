import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
  // Embedded product snapshot for quick access
  name: { type: String },
  price: { type: Number },
  image: { type: String },
}, { _id: false });

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total price
cartSchema.virtual('totalPrice').get(function () {
  return this.items.reduce((total, item) => {
    return total + (item.price || 0) * item.quantity;
  }, 0);
});

// Index on user
cartSchema.index({ user: 1 });

// Optionally auto-populate product on find
cartSchema.pre(/^find/, function (next) {
  this.populate('items.product');
  next();
});

export default mongoose.model('Cart', cartSchema);
