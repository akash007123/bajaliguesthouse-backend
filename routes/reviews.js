const express = require('express');
const router = express.Router();
const {
  getReviews,
  createReview,
  getAllReviews,
  updateReviewStatus,
  deleteReview
} = require('../controllers/reviewController');
const { auth } = require('../middleware/auth');

// Public routes
router.get('/', getReviews);
router.post('/', createReview);

// Admin routes
router.get('/admin', auth, getAllReviews);
router.put('/:id/status', auth, updateReviewStatus);
router.delete('/:id', auth, deleteReview);

module.exports = router;