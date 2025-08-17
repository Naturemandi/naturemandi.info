import express from 'express';
import {
  submitFeedback,
  getAllFeedback,
  deleteFeedback,
} from '../controllers/feedbackController.js';
import protect from '../middleware/authMiddleware.js';
import adminOnly from '../middleware/adminOnly.js';

const router = express.Router();

// 🔐 Admin Routes (must come first)
router.get('/admin/all', protect, adminOnly, getAllFeedback);     // Get all feedback
router.delete('/admin/:id', protect, adminOnly, deleteFeedback);  // Delete a feedback entry

// 🧾 User Feedback Submission
router.post('/', protect, submitFeedback);                        // Submit feedback for an order

export default router;
