import mongoose from 'mongoose';
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    images: {
      type: [String], // ✅ array of image URLs
      default: [],
    },
    description: String,
    price: { type: Number, required: true },
    category: String,

    countInStock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    reviews: [reviewSchema],
    numReviews: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ⭐ Calculate average rating
productSchema.methods.calculateRatings = function () {
  const total = this.reviews.reduce((acc, r) => acc + r.rating, 0);
  this.numReviews = this.reviews.length;
  this.averageRating = this.reviews.length ? (total / this.reviews.length).toFixed(1) : 0;
};

// ➕ Add review safely
productSchema.methods.addReview = function (newReview) {
  const alreadyReviewed = this.reviews.find(
    (r) => r.user.toString() === newReview.user.toString()
  );
  if (alreadyReviewed) {
    throw new Error('You have already reviewed this product');
  }
  this.reviews.push(newReview);
  this.calculateRatings();
  return this.save();
};

// ❌ Remove a review
productSchema.methods.removeReview = function (reviewId) {
  this.reviews = this.reviews.filter((r) => r._id.toString() !== reviewId);
  this.calculateRatings();
  return this.save();
};

// ✅ Virtual field for stock status
productSchema.virtual('isInStock').get(function () {
  return this.countInStock > 0;
});

// 🔁 Ensure virtuals appear in JSON
productSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Product', productSchema);
