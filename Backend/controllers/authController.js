import generateToken from '../utils/generateToken.js';
import admin from '../config/firebase.js'; 
import User from '../models/User.js';

// ✅ Define allowed admin phone numbers or emails
const ADMIN_IDENTIFIERS = [
  '6006061464', 
  'naturemandi.info@gmail.com', 
];

// 🔐 Firebase OTP verification
export const verifyFirebaseOtp = async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ error: 'No ID token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const phone = decodedToken.phone_number;

    if (!phone) {
      return res.status(400).json({ error: 'No phone number in token' });
    }

    const phoneOrEmail = phone.replace('+91', '');

    // ✅ Check if this phone/email is in the admin list
    const isAdmin = ADMIN_IDENTIFIERS.includes(phoneOrEmail);

    // Find or create user atomically
    let user = await User.findOne({ phoneOrEmail });
    if (!user) {
      user = await User.create({ phoneOrEmail, isVerified: true, isAdmin });
    } else {
      user.isVerified = true;
      if (!user.isAdmin && isAdmin) user.isAdmin = true;
      await user.save();
    }

    const token = generateToken(user._id);

    res.status(200).json({
      msg: 'OTP Verified successfully',
      token,
      user,
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid or expired Firebase token', details: error.message });
  }
};

// 👤 Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-__v');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// 💖 Get favorites
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('favorites', 'name imageUrl price');
    res.json(user.favorites || []);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// 💖 Add favorite
export const addFavorite = async (req, res) => {
  const { productId } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user.favorites.includes(productId)) {
      user.favorites.push(productId);
      await user.save();
    }
    res.json({ msg: 'Added to favorites', favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// 💔 Remove favorite
export const removeFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.favorites = user.favorites.filter(
      (fav) => fav.toString() !== req.params.productId
    );
    await user.save();
    res.json({ msg: 'Removed from favorites', favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// 🏠 Add address
export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.push(req.body.address);
    await user.save();
    res.json({ msg: 'Address added', addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// 🏠 Update addresses
export const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = req.body.addresses || [];
    await user.save();
    res.json({ msg: 'Addresses updated', addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// 🏠 Delete address
export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(
      (addr, idx) => idx.toString() !== req.params.id
    );
    await user.save();
    res.json({ msg: 'Address deleted', addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// 🏠 Get addresses
export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.addresses || []);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// 👤 Update user profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phoneOrEmail = req.body.phoneOrEmail || user.phoneOrEmail;

    await user.save();
    res.json({ msg: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
