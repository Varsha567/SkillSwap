const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists by email
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        // Check if username already exists (for non-Google users)
        user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'This username is already taken.' });
        }

        user = new User({
            username,
            email,
            password, // Password will be hashed by pre-save hook in User model
            profileComplete: false // New users start with incomplete profile
        });

        await user.save();

        // Generate JWT
        const payload = {
            user: {
                id: user.id, // Mongoose virtual 'id' for _id
                username: user.username,
                email: user.email,
                profileComplete: user.profileComplete
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }, // For testing, keep this short (e.g., '10s' or '30s')
            (err, token) => {
                if (err) throw err;
                // Return consistent user data structure
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
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Handle Google users trying to login with password
        if (user.googleId && !user.password) {
            return res.status(400).json({ message: 'This account was registered with Google. Please continue with Google.' });
        }
        if (!user.password) { // Safety check if password field is simply missing (shouldn't happen for manual users)
             return res.status(400).json({ message: 'Account has no password set. Please use Google login if applicable.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT
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
            { expiresIn: '1h' }, // For testing, keep this short (e.g., '10s' or '30s')
            (err, token) => {
                if (err) throw err;
                // Return consistent user data structure
                res.json({ 
                    message: 'Logged in successfully!', 
                    token, 
                    userId: user.id, // Consistent naming for frontend
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
