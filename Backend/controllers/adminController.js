import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// Dashboard Stats: Orders, Revenue, Products, Users
export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    res.json({
      totalOrders,
      totalRevenue,
      totalProducts,
      totalUsers,
    });
  } catch (err) {
    console.error('Dashboard Stats Error:', err);
    res.status(500).json({ message: 'Server Error while fetching dashboard stats' });
  }
};

// Get All Orders (optionally limit for recent ones)
export const getAllOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('user', 'name email')
      .populate('items.product', 'name price');

    res.json(orders);
  } catch (err) {
    console.error('Get Orders Error:', err);
    res.status(500).json({ message: 'Server Error while fetching orders' });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-otp -password'); // exclude sensitive fields
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

