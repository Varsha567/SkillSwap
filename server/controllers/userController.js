// server/controllers/userController.js
const User = require('../models/User');

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        // req.userId is set by the auth middleware
        const user = await User.findById(req.userId).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update user profile (for the "Complete Profile" page)
exports.updateUserProfile = async (req, res) => {
    const { fullName, skillsOffered, skillsNeeded, bio } = req.body; // Destructure the fields

    try {
        // Find the user by ID (from auth middleware) and update
        const user = await User.findByIdAndUpdate(
            req.userId,
            {
                fullName,
                skillsOffered,
                skillsNeeded,
                bio,
                profileComplete: true // Set to true after updating profile
            },
            { new: true, runValidators: true } // Return the updated document, run schema validators
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};