import express from 'express';
import {
  createCoupon,
  applyCoupon,
  getCoupons,
  deleteCoupon,
} from '../controllers/couponController.js';
import protect from '../middleware/authMiddleware.js';
import adminOnly from '../middleware/adminOnly.js';

const router = express.Router();

router.post('/create', protect, adminOnly, createCoupon); // Admin
router.get('/', protect, adminOnly, getCoupons);          // Admin
router.delete('/:id', protect, adminOnly, deleteCoupon);  // Admin
router.post('/apply', protect, applyCoupon);              // User

export default router;
