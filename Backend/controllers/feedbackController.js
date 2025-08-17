import Feedback from '../models/Feedback.js';

// @desc    Submit feedback (supports both guests and logged-in users)
// @route   POST /api/feedback
// @access  Public or Protected
export const submitFeedback = async (req, res) => {
  const { name, email, message, rating, orderId } = req.body;

  try {
    const feedback = new Feedback({
      name: name || (req.user?.name ?? 'Anonymous'),
      email: email || (req.user?.email ?? 'Not Provided'),
      message,
      rating,
      userId: req.user?._id || null,
      orderId: orderId || null,
    });

    const savedFeedback = await feedback.save();
    res.status(201).json({ msg: '✅ Feedback submitted successfully', feedback: savedFeedback });
  } catch (error) {
    console.error('❌ Feedback Submission Error:', error);
    res.status(500).json({ msg: 'Server error: Unable to submit feedback' });
  }
};

// @desc    Admin - Get all feedback
// @route   GET /api/feedback/admin/all
// @access  Admin Only
export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email') // optional: show user info
      .populate('orderId', '_id');

    res.json(feedbacks);
  } catch (error) {
    console.error('❌ Fetch Feedback Error:', error);
    res.status(500).json({ msg: 'Failed to fetch feedback' });
  }
};

// @desc    Admin - Delete feedback by ID
// @route   DELETE /api/feedback/admin/:id
// @access  Admin Only
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({ msg: 'Feedback not found' });
    }

    res.json({ msg: '🗑️ Feedback deleted successfully' });
  } catch (error) {
    console.error('❌ Delete Feedback Error:', error);
    res.status(500).json({ msg: 'Server error while deleting feedback' });
  }
};
