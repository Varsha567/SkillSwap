const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config();

// Google authentication route
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google authentication callback route
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }), 
  (req, res) => {
    try {
      // Ensure req.user has been populated correctly by Passport strategy
      if (!req.user) {
        throw new Error('Passport did not populate req.user after Google auth.');
      }

      const payload = {
        user: {
          id: req.user.id,
          username: req.user.username, // From your User model (generated or linked)
          email: req.user.email,       // From your User model
          profileComplete: req.user.profileComplete || false,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' }, // Adjust for testing (e.g., '10s', '30s')
        (err, token) => {
          if (err) throw err;
          
          // CRITICAL FIX: Include username and email in the redirect URL
          const redirectUrl = `http://localhost:3000/auth/google/callback?token=${token}&userId=${req.user.id}&profileComplete=${req.user.profileComplete || false}&username=${encodeURIComponent(req.user.username)}&email=${encodeURIComponent(req.user.email)}`;
          res.redirect(redirectUrl);
        }
      );
    } catch (err) {
      console.error('Error generating JWT or redirecting after Google auth:', err);
      // More informative error message
      res.redirect('http://localhost:3000/login?error=google_auth_failed&details=' + encodeURIComponent(err.message));
    }
  }
);

module.exports = router;
