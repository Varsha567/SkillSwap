const User = require('../models/User');
const Post = require('../models/PostS');

exports.completeProfile = async (req, res) => {
  try {
    const { bio, skills, needs, discordHandle, profilePicUrl } = req.body;
    const userId = req.userId; // From auth middleware

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        bio,
        discordHandle,
        profilePicUrl,
        skills: skills ? skills.split(',').map(s => s.trim()) : [],
        needs: needs ? needs.split(',').map(n => n.trim()) : []
      },
      { new: true }
    );

    // Fetch user's posts
    const userPosts = await Post.find({ postedBy: userId });

    res.status(200).json({
      user: updatedUser,
      posts: userPosts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Profile completion failed' });
  }
};
