import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

import {protect, adminOnly} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, adminOnly, createProduct);       // Only Admin
router.put('/:id', protect, adminOnly, updateProduct);     // Only Admin
router.delete('/:id', protect, adminOnly, deleteProduct);  // Only Admin

router.get('/', getAllProducts);               // Public
router.get('/:id', getProductById);            // Public

export default router;
