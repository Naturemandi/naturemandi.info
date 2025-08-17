// controllers/supportController.js
import SupportMessage from '../models/SupportChart.js';

export const createSupportMessage = async (req, res) => {
  try {
    const message = await SupportMessage.create({
      user: req.user._id,
      text: req.body.text,
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save message' });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const messages = await SupportMessage.find().populate('user', 'name email');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load messages' });
  }
};
