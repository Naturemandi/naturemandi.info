import express from 'express';
import upload from '../middlewares/Upload.js';

const router = express.Router();

router.post('/product-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    console.error('Upload error:', req.file);
    return res.status(400).json({ error: 'No file uploaded or upload failed.' });
  }
  res.json({ url: req.file.path });
});

// Add a global error handler for multer/cloudinary errors
router.use((err, req, res, next) => {
  console.error('Upload route error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

export default router;