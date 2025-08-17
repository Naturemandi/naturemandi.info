import Coupon from '../models/Coupon.js';
import User from '../models/User.js';

// Admin - Create Coupon
export const createCoupon = async (req, res) => {
  try {
    const { code, discount, expiresAt, usageLimit } = req.body;

    const exists = await Coupon.findOne({ code });
    if (exists) return res.status(400).json({ msg: 'Coupon already exists' });

    const newCoupon = await Coupon.create({
      code,
      discount,
      expiresAt,
      usageLimit,
    });

    res.status(201).json(newCoupon);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create coupon' });
  }
};

// User - Apply Coupon
export const applyCoupon = async (req, res) => {
  const { code } = req.body;
  const userId = req.user._id;

  try {
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) return res.status(404).json({ msg: 'Coupon not found' });

    if (new Date() > coupon.expiresAt) return res.status(400).json({ msg: 'Coupon expired' });

    if (coupon.usedBy.includes(userId)) return res.status(400).json({ msg: 'You already used this coupon' });

    if (coupon.usedBy.length >= coupon.usageLimit) return res.status(400).json({ msg: 'Coupon usage limit reached' });

    res.json({ discount: coupon.discount, msg: 'Coupon applied successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to apply coupon' });
  }
};

// Admin - Get all coupons
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch coupons' });
  }
};

// Admin - Delete coupon
export const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete coupon' });
  }
};
