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
                // If Passport didn't populate req.user, it's an internal server error or misconfiguration
                console.error('Passport did not populate req.user after Google auth. User object:', req.user);
                return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed&details=${encodeURIComponent('Authentication failed: User data not found.')}`);
            }

            const payload = {
                user: {
                    id: req.user.id,
                    username: req.user.username, // From your User model (generated or linked)
                    email: req.user.email,     // From your User model
                    profileComplete: req.user.profileComplete || false,
                },
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1h' },
                (err, token) => {
                    if (err) {
                        console.error('Error signing JWT after Google auth:', err);
                        return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed&details=${encodeURIComponent('Failed to generate session token.')}`);
                    }
                    
                    // CRITICAL FIX: Dynamically redirect to the FRONTEND_URL
                    const frontendRedirectBase = process.env.FRONTEND_URL; // Your deployed frontend URL
                    const redirectUrl = `${frontendRedirectBase}/auth/google/callback?token=${token}&userId=${req.user.id}&profileComplete=${req.user.profileComplete || false}&username=${encodeURIComponent(req.user.username)}&email=${encodeURIComponent(req.user.email)}`;
                    
                    console.log('Redirecting to frontend:', redirectUrl); // For debugging
                    res.redirect(redirectUrl);
                }
            );
        } catch (err) {
            console.error('Error during Google auth callback:', err);
            // Redirect to frontend login with an error message
            res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed&details=${encodeURIComponent(err.message)}`);
        }
    }
);

module.exports = router;
