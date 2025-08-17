import express from 'express';
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  updateCartQuantity,
} from '../controllers/cartController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.delete('/remove/:id', protect, removeFromCart);
router.delete('/clear', protect, clearCart);
router.put('/update/:productId', protect, updateCartQuantity);

export default router;
