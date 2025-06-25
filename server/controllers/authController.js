const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendEmail } = require('../utils/emailService');
require('dotenv').config();

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'This username is already taken.' });
        }

        user = new User({
            username,
            email,
            password,
            profileComplete: false
        });

        await user.save();

        const payload = {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                profileComplete: user.profileComplete
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ 
                    message: 'User registered successfully!', 
                    token, 
                    userId: user.id,
                    username: user.username,
                    email: user.email,
                    profileComplete: user.profileComplete
                });
            }
        );

    } catch (err) {
        console.error('Error during registration:', err.message);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: `Validation Error: ${messages.join(', ')}` });
        }
        res.status(500).send('Server error during registration.');
    }
};

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // IMPORTANT: Always select password explicitly when needed for login/comparison
        let user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // --- REVISED LOGIC FOR PASSWORD CHECK ---
        // If the user has a googleId AND NO password set, redirect them to Google login.
        // This covers accounts created *only* via Google.
        if (user.googleId && (!user.password || user.password === null)) {
            return res.status(400).json({ message: 'This account was registered with Google. Please continue with Google.' });
        }
        
        // If the user does NOT have a password (e.g., a hybrid account where password was removed, or Google-only that slipped through)
        // AND they are trying to login manually, then they cannot.
        // This implicitly handles cases where user.password might be empty string or null for some reason.
        if (!user.password) {
            return res.status(400).json({ message: 'This account has no password for manual login. Please use Google login or register with an email and password.' });
        }
        // --- END REVISED LOGIC ---

        // Only compare password if it exists on the user object
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const payload = {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                profileComplete: user.profileComplete
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    message: 'Logged in successfully!', 
                    token, 
                    userId: user.id,
                    username: user.username,
                    email: user.email,
                    profileComplete: user.profileComplete
                });
            }
        );

    } catch (err) {
        console.error('Error during login:', err.message);
        res.status(500).send('Server error during login.');
    }
};

// @route   POST api/auth/forgotpassword
// @desc    Request password reset link
// @access  Public
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // CRITICAL FIX: Explicitly select the password field to check its existence
        const user = await User.findOne({ email }).select('+password'); 

        if (!user) {
            // Send a generic success message to prevent email enumeration
            return res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
        }

        // Check if it's a Google-only account (has googleId AND no password)
        if (user.googleId && (!user.password || user.password === null)) {
            return res.status(400).json({ message: 'This account was registered with Google. Password reset is not applicable.' });
        }
        
        // This check is for manually registered accounts that somehow don't have a password.
        // It should now correctly evaluate to false if the user *does* have a password.
        if (!user.password) { 
             return res.status(400).json({ message: 'This account has no password for manual reset. Please register with an email and password, or use Google login if applicable.' });
        }

        const resetToken = user.getResetPasswordToken(); // Generate and save token

        await user.save({ validateBeforeSave: false }); // Save user with new token/expiry, bypass validation

        const resetURL = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'SkillSwap Password Reset Token',
                html: `
                    <p>Hello ${user.username || user.email},</p>
                    <p>You have requested to reset your password for your SkillSwap account.</p>
                    <p>Please click on the link below to reset your password. This link is valid for 10 minutes:</p>
                    <p><a href="${resetURL}" target="_blank" rel="noopener noreferrer" style="background-color: #F3B05C; color: #1A1A2E; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Your Password</a></p>
                    <p>If you did not request a password reset, please ignore this email.</p>
                    <p>Thank you,<br/>The SkillSwap Team</p>
                `
            });

            res.status(200).json({ message: 'Password reset link sent to your email.' });

        } catch (error) {
            console.error('Error sending reset email:', error);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            res.status(500).json({ message: 'Email could not be sent. Please try again later.' });
        }

    } catch (err) {
        console.error('Error during forgot password request:', err.message);
        res.status(500).send('Server error during forgot password request.');
    }
};


// @route   PUT api/auth/resetpassword/:token
// @desc    Reset password
// @access  Public
exports.resetPassword = async (req, res) => {
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token.' });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ message: 'Password has been successfully reset.' });

    } catch (err) {
        console.error('Error during password reset:', err.message);
        res.status(500).send('Server error during password reset.');
    }
};
