const User = require('../models/User'); // Assuming your User model is here

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
exports.getOwnProfile = async (req, res) => {
    try {
        // req.userId is set by the auth middleware from the JWT payload
        const user = await User.findById(req.userId).select('-password'); // Exclude password from response

        if (!user) {
            console.log('Backend /api/profile/me: User not found for ID:', req.userId);
            return res.status(404).json({ message: 'User not found.' });
        }

        // Return the user object, which includes profile fields
        res.json(user);
    } catch (err) {
        console.error('Backend /api/profile/me error:', err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST api/profile/complete
// @desc    Complete or update user profile (initial setup or subsequent edits)
// @access  Private
exports.completeProfile = async (req, res) => {
    const { fullName, bio, skillsOffered, skillsNeeded, discordHandle } = req.body;

    try {
        let user = await User.findById(req.userId);

        if (!user) {
            console.log('Backend /api/profile/complete: User not found for ID:', req.userId);
            return res.status(404).json({ message: 'User not found for update.' });
        }

        // Update user profile fields
        user.fullName = fullName;
        user.bio = bio;
        user.skillsOffered = skillsOffered;
        user.skillsNeeded = skillsNeeded;
        user.discordHandle = discordHandle;
        user.profileComplete = true; // Mark profile as complete

        await user.save();
        
        // Return the updated user object (excluding password)
        // This is important for the frontend's AuthContext to update its user state
        const updatedUser = await User.findById(user._id).select('-password');
        res.json({ message: 'Profile updated successfully!', user: updatedUser });

    } catch (err) {
        console.error('Backend /api/profile/complete error:', err.message);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: `Validation Error: ${messages.join(', ')}` });
        }
        res.status(500).send('Server Error during profile update.');
    }
};

// @route   GET api/profile/:userId
// @desc    Get any user's public profile
// @access  Public
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password'); // Exclude password

        if (!user) {
            console.log('Backend /api/profile/:userId: User not found for ID:', req.params.userId);
            return res.status(404).json({ message: 'User not found.' });
        }

        // Only return public profile data
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email, // Can be omitted for public view if preferred
            fullName: user.fullName,
            bio: user.bio,
            skillsOffered: user.skillsOffered,
            skillsNeeded: user.skillsNeeded,
            discordHandle: user.discordHandle,
            profileComplete: user.profileComplete,
        });
    } catch (err) {
        console.error('Backend /api/profile/:userId error:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid User ID format.' });
        }
        res.status(500).send('Server Error');
    }
};
