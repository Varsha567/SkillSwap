const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth'); // Your authentication middleware

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
// Make sure this route is correctly defined and uses the auth middleware
router.get('/me', auth, profileController.getOwnProfile);

// @route   POST api/profile/complete
// @desc    Complete or update user profile (initial setup or subsequent edits)
// @access  Private
router.post('/complete', auth, profileController.completeProfile);

// @route   GET api/profile/:userId
// @desc    Get any user's public profile
// @access  Public
router.get('/:userId', profileController.getUserProfile);

module.exports = router;
