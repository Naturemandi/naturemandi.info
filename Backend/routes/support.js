// routes/support.js
import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { createSupportMessage, getAllMessages } from '../controllers/supportController.js';

const router = express.Router();

router.post('/', protect, createSupportMessage);       // Save message
router.get('/admin', getAllMessages);                  // Admin fetches all messages

export default router;
