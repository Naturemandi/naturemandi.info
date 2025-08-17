import Product from '../models/Product.js';
import { Parser } from 'json2csv';

// ✅ Add or update a product review
// @route   POST /api/products/:productId/reviews
// @access  Protected
export const addReview = async (req, res) => {
  const userId = req.user._id;
  const { rating, comment } = req.body;
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: 'Product not found' });

    const existingReview = product.reviews.find(
      (r) => r.user.toString() === userId.toString()
    );

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
      existingReview.updatedAt = Date.now();
    } else {
      product.reviews.push({
        user: userId,
        name: req.user.name || req.user.phoneOrEmail,
        rating,
        comment,
      });
    }

    product.calculateRatings(); // method in Product model to calculate avg rating
    await product.save();

    res.status(201).json({ msg: 'Review submitted', reviews: product.reviews });
  } catch (err) {
    console.error('Review submission error:', err);
    res.status(500).json({ msg: 'Something went wrong' });
  }
};

// ✅ Get all reviews for a single product
// @route   GET /api/products/:productId/reviews
// @access  Public
export const getReviews = async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId).select('reviews');
    if (!product) return res.status(404).json({ msg: 'Product not found' });

    res.json(product.reviews);
  } catch (err) {
    console.error('Get reviews error:', err);
    res.status(500).json({ msg: 'Failed to fetch reviews' });
  }
};

// ✅ Admin: Get all reviews across all products
// @route   GET /api/reviews/admin/all
// @access  Admin only
export const getAllReviews = async (req, res) => {
  try {
    const products = await Product.find({}, 'name reviews');

    const allReviews = [];

    products.forEach((product) => {
      product.reviews.forEach((review) => {
        allReviews.push({
          _id: review._id,
          productId: product._id,
          productName: product.name,
          name: review.name,
          user: review.user,
          comment: review.comment,
          rating: review.rating,
          createdAt: review.createdAt,
        });
      });
    });

    res.json(allReviews);
  } catch (err) {
    console.error('Fetch all reviews error:', err);
    res.status(500).json({ msg: 'Failed to fetch all reviews' });
  }
};

// ✅ Admin: Delete a review from a product
// @route   DELETE /api/reviews/admin/:reviewId
// @access  Admin only
export const deleteReview = async (req, res) => {
  const reviewId = req.params.reviewId;

  try {
    const products = await Product.find();

    let reviewFound = false;

    for (const product of products) {
      const originalLength = product.reviews.length;
      product.reviews = product.reviews.filter(
        (r) => r._id.toString() !== reviewId
      );

      if (product.reviews.length !== originalLength) {
        reviewFound = true;
        product.calculateRatings();
        await product.save();
        break;
      }
    }

    if (!reviewFound) {
      return res.status(404).json({ msg: 'Review not found' });
    }

    res.json({ msg: 'Review deleted successfully' });
  } catch (err) {
    console.error('Delete review error:', err);
    res.status(500).json({ msg: 'Error deleting review' });
  }
};

// ✅ Admin: Export all reviews as CSV
// @route   GET /api/reviews/admin/export
// @access  Admin only
export const exportReviewsCSV = async (req, res) => {
  try {
    const products = await Product.find({}, 'name reviews');

    const rows = [];

    products.forEach((product) => {
      product.reviews.forEach((r) => {
        rows.push({
          ReviewID: r._id,
          ProductName: product.name,
          Reviewer: r.name,
          Rating: r.rating,
          Comment: r.comment,
          Date: new Date(r.createdAt).toLocaleDateString(),
        });
      });
    });

    const parser = new Parser();
    const csv = parser.parse(rows);

    res.header('Content-Type', 'text/csv');
    res.attachment('product_reviews.csv');
    return res.send(csv);
  } catch (err) {
    console.error('CSV export error:', err);
    res.status(500).json({ msg: 'CSV export failed' });
  }
};
