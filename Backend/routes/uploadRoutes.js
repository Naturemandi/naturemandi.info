import express from 'express';
import upload from '../middlewares/Upload.js';

const router = express.Router();

router.post('/product-image', upload.single('image'), (req, res) => {
  res.json({ url: req.file.path });
});

export default router;
