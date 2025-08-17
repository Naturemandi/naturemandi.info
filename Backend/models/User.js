import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  label: { type: String, required: true },   // e.g., "Home", "Office"
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pin: { type: String, required: true },
  altPhone: { type: String, default: '' }
});

const userSchema = new mongoose.Schema(
  {
    phoneOrEmail: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    addresses: [addressSchema],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;