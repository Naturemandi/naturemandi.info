import express from 'express';
import { getDashboardStats, getAllOrders, getAllUsers } from '../controllers/adminController.js';
import {protect, adminOnly} from '../middlewares/authMiddleware.js';

const router = express.Router();

// Admin-protected routes
router.get('/metrics', protect, adminOnly, getDashboardStats);
router.get('/orders', protect, adminOnly, getAllOrders);
router.get('/users', protect, adminOnly, getAllUsers);


export default router;
