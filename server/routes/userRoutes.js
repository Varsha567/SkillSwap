// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Your auth middleware
const userController = require('../controllers/userController');

// GET /api/user/profile - Get logged-in user's profile
router.get('/profile', auth, userController.getUserProfile);

// PUT /api/user/profile - Update logged-in user's profile
router.put('/profile', auth, userController.updateUserProfile);

module.exports = router;