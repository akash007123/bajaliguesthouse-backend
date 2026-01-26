const Review = require('../models/Review');

// Get all approved reviews with user details
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true })
      .populate('userId', 'name profilePicture')
      .sort({ createdAt: -1 });

    // Transform to match frontend interface
    const populatedReviews = reviews.map(review => ({
      id: review._id,
      userName: review.userName,
      rating: review.rating,
      feedback: review.feedback,
      userId: review.userId ? {
        profilePicture: review.userId.profilePicture,
        name: review.userId.name
      } : null
    }));

    res.json(populatedReviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new review
const createReview = async (req, res) => {
  try {
    const { userId, userName, rating, feedback } = req.body;

    const review = new Review({
      userId,
      userName,
      rating,
      feedback,
      approved: false // Reviews need approval before display
    });

    await review.save();
    res.status(201).json({ message: 'Review submitted for approval' });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all reviews (admin)
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'name profilePicture')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve or reject review (admin)
const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    const review = await Review.findByIdAndUpdate(id, { approved }, { new: true });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    console.error('Error updating review status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete review (admin)
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    res.json({ message: 'Review deleted' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getReviews,
  createReview,
  getAllReviews,
  updateReviewStatus,
  deleteReview
};