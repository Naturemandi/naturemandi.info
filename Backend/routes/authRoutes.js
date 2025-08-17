import express from 'express';
import {
  getUserProfile,
  updateProfile,
  getFavorites,
  addFavorite,
  removeFavorite,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  verifyFirebaseOtp
} from '../controllers/authController.js';

import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 🔐 Firebase OTP verification (public)
router.post('/verify-firebase-otp', verifyFirebaseOtp);

// 👤 Profile
router.get('/me', protect, getUserProfile);
router.put('/me', protect, updateProfile);

// 💖 Favorites
router.get('/favorites', protect, getFavorites);
router.post('/favorites', protect, addFavorite);
router.delete('/favorites/:productId', protect, removeFavorite); // fixed param

// 🏠 Addresses
router.get('/addresses', protect, getAddresses);
router.post('/addresses', protect, addAddress);
router.put('/addresses/:id', protect, updateAddress);
router.delete('/addresses/:id', protect, deleteAddress);

// --- ALIASES for frontend compatibility ---
// Profile aliases
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfile);

// Addresses alias: expects full array of addresses in body
router.put('/addresses', protect, updateAddress);

export default router;