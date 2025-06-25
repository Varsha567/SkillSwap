const express = require('express');
const router = express.Router();
const authController=require('../controllers/authController'); // Make sure this path is correct
const auth = require('../middleware/auth'); // Ensure your auth middleware is correctly imported

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
// Ensure authController.registerUser is actually a function
router.post('/register', authController.registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
// Ensure authController.loginUser is actually a function
router.post('/login', authController.loginUser);

// Example of a protected route using the auth middleware
// router.get('/protected', auth, (req, res) => {
//   res.json({ message: `Welcome, user ${req.userId}! This is protected data.` });
// });
// NEW: Request Password Reset Link
// @route   POST api/auth/forgotpassword
// @desc    Send password reset link to email
// @access  Public
router.post('/forgotpassword', authController.forgotPassword);

// NEW: Reset Password
// @route   PUT api/auth/resetpassword/:token
// @desc    Reset user's password using token
// @access  Public
router.put('/resetpassword/:token', authController.resetPassword);

// Example of a protected route using the auth middleware
// router.get('/protected', auth, (req, res) => {
//   res.json({ message: `Welcome, user ${req.userId}! This is protected data.` });
// });
module.exports = router;
