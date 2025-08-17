import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }, // Use bcrypt for hashing
});

export default mongoose.model('Admin', adminSchema);
