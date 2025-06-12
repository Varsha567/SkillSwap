const User = require('../models/User');

// @route POST /api/profile/complete
// @desc Complete user profile (requires auth)
// @access Private
exports.completeProfile = async (req, res) => {
  try {
    const userId = req.userId; // Set by your auth middleware
    const { fullName, bio, skillsOffered, skillsNeeded } = req.body;

    // Find the user and update their profile fields
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.fullName = fullName;
    user.bio = bio;
    user.skillsOffered = skillsOffered;
    user.skillsNeeded = skillsNeeded;
    user.profileComplete = true; // Mark profile as complete

    await user.save();

    res.status(200).json({ message: 'Profile completed successfully!', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during profile completion' });
  }
};

// @route GET /api/profile/me
// @desc Get current authenticated user's profile
// @access Private
exports.getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select('-password'); // Exclude password

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

// @route GET /api/profile/:userId
// @desc Get any user's profile by ID
// @access Public (can be accessed by anyone, but maybe limit fields for public view)
exports.getUserProfileById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password -email -isAdmin'); // Adjust fields for public view

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    // CastError can happen if ID is malformed
    if (err.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid user ID' });
    }
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
};