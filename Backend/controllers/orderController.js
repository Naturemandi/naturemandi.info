import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Coupon from '../models/Coupen.js'; // Ensure this exists
import nodemailer from 'nodemailer';

// 🛒 Place a new order
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingAddress, paymentMethod = 'COD', couponCode = '' } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: 'Cart is empty' });
    }

    let totalAmount = cart.items.reduce((acc, item) => {
      return acc + item.quantity * item.product.price;
    }, 0);

    let discount = 0;
    let appliedCoupon = '';

    // ✅ Apply coupon if provided
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.trim().toUpperCase() });
      if (!coupon) {
        return res.status(400).json({ msg: 'Invalid coupon code' });
      }

      discount = coupon.discount || 0;
      appliedCoupon = coupon.code;
      totalAmount = totalAmount - (totalAmount * discount) / 100;
    }

    const order = await Order.create({
      user: userId,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      shippingAddress,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      appliedCoupon,
      discount,
      paymentMethod,
      isPaid: paymentMethod === 'Online',
      paidAt: paymentMethod === 'Online' ? Date.now() : null,
      status: 'Confirmed',
    });

    // 🧹 Clear the cart
    await Cart.findOneAndDelete({ user: userId });

    res.status(201).json({ msg: 'Order placed successfully', order });
  } catch (err) {
    console.error('Place order error:', err);
    res.status(500).json({ msg: 'Failed to place order' });
  }
};

// 👤 Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch orders' });
  }
};

// 🛠️ Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'phoneOrEmail')
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch all orders' });
  }
};

// 🚚 Admin: Mark order as delivered
export const markAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: 'Order not found' });

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'Delivered';

    await order.save();

    res.json({ msg: 'Marked as delivered', order });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to mark as delivered' });
  }
};

// 📦 Admin: Update tracking information
// 🛠️ Admin: Update tracking info
export const updateTrackingInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { courier, trackingId, estimatedDeliveryDate } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ msg: 'Order not found' });

    order.courier = courier || order.courier;
    order.trackingId = trackingId || order.trackingId;
    order.estimatedDeliveryDate = estimatedDeliveryDate || order.estimatedDeliveryDate;

    await order.save();
    res.json({ msg: 'Tracking info updated', order });
  } catch (err) {
    console.error('Update tracking error:', err);
    res.status(500).json({ msg: 'Failed to update tracking info' });
  }
};

const sendOrderEmail = async (userEmail, orderDetails) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'yourappemail@gmail.com',
      pass: process.env.APP_EMAIL_PASSWORD,
    },
  });

  const message = {
    from: 'ShuddhIndia <yourappemail@gmail.com>',
    to: userEmail,
    subject: 'Your Order Confirmation',
    html: `<h2>Thank you for your order!</h2>
           <p>Order ID: ${orderDetails._id}</p>
           <p>Total: ₹${orderDetails.total}</p>`,
  };

  await transporter.sendMail(message);
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    // Only allow user to access their own order (unless admin)
    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch order' });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: 'Order not found' });

    // Only allow cancellation if the order is not delivered or cancelled
    if (order.isDelivered || order.status === 'Cancelled') {
      return res.status(400).json({ msg: 'Cannot cancel this order' });
    }

    order.status = 'Cancelled';
    await order.save();

    res.json({ msg: 'Order cancelled successfully', order });
  }catch (err) {
  console.error(err);
  alert(err.response?.data?.msg || 'Failed to cancel order');
}
};