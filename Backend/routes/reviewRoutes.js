import express from 'express';
import {
  addReview,
  getReviews,
  getAllReviews,
  deleteReview,
  exportReviewsCSV,
} from '../controllers/reviewController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 🔐 Admin Routes first to avoid conflict with :productId
router.get('/admin/all', protect, adminOnly, getAllReviews);
router.get('/admin/export', protect, adminOnly, exportReviewsCSV);
router.delete('/admin/:reviewId', protect, adminOnly, deleteReview);

// 👤 User Routes
router.post('/:productId', protect, addReview);         // Add/update review
router.get('/:productId', getReviews);                  // Get reviews for product

export default router;
