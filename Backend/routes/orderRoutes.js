import express from 'express';
import {
  placeOrder,
  getUserOrders,
  getAllOrders,
  markAsDelivered,
  updateTrackingInfo,
  getOrderById,
  cancelOrder
} from '../controllers/orderController.js';
import { protect, adminOnly} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/place', placeOrder);
router.get('/my', getUserOrders);
router.get('/all', adminOnly, getAllOrders);
router.put('/:id/deliver', adminOnly, markAsDelivered);
router.get('/:id', getOrderById);
// PUT /api/orders/:id/cancel
router.delete('/:id/cancel', protect, cancelOrder)


// ✅ New: Admin updates tracking
router.put('/:id/tracking', adminOnly, updateTrackingInfo);
    
export default router;
