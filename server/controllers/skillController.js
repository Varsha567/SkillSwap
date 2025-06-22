const PostS = require('../models/PostS');
const User = require('../models/User');

// @route   POST api/skills
// @desc    Create a new skill listing
// @access  Private (requires authentication)
exports.createSkillListing = async (req, res) => {
  const { title, description, category, skillLevel, swapFor } = req.body;

  try {
    const user = await User.findById(req.userId).select('username'); 

    if (!user) {
      return res.status(404).json({ message: 'Authenticated user not found in database.' });
    }

    const newPost = new PostS({
      title,
      description,
      category,
      skillLevel,
      swapFor,
      userId: req.userId,
      username: user.username,
      status: 'active', // Based on your provided code, defaulting to 'active'
      lastStatusUpdate: Date.now() // Add this to track last update time
    });

    const post = await newPost.save();
    res.status(201).json({ message: 'Skill listing posted successfully!', post });

  } catch (err) {
    console.error('Error creating skill post:', err.message);

    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: `Validation Error: ${messages.join(', ')}` });
    }
    
    res.status(500).json({ message: 'Server error during skill post creation. Check backend console for details.' });
  }
};

// @route   GET api/skills
// @desc    Get all active skill listings
// @access  Public
exports.getAllSkills = async (req, res) => {
  try {
    const skills = await PostS.find({ status: 'active' }).sort({ createdAt: -1 }); // Only show 'active' skills
    res.status(200).json({ listings: skills });
  } catch (err) {
    console.error('Error fetching all skills:', err.message);
    res.status(500).json({ message: 'Server error while fetching skills.' });
  }
};

// @route   GET api/skills/user/:userId
// @desc    Get all skill listings by a specific user (including all statuses if owned by auth user)
// @access  Public (but owner can see all statuses if authenticated)
exports.getUserSkills = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!require('mongoose').Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }

    let query = { userId };
    // If the request is from the authenticated owner (req.userId), they can see all their statuses.
    // Otherwise, public view of another user's profile only shows 'active' posts.
    if (req.userId && req.userId === userId) {
        // No additional status filter for owner's view
    } else {
        query.status = 'active'; // Public view of another user's profile only shows active posts
    }

    const skills = await PostS.find(query).sort({ createdAt: -1 });
    res.status(200).json({ listings: skills });
  } catch (err) {
    console.error('Error fetching user skills:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid user ID format (CastError).' });
    }
    res.status(500).json({ message: 'Server error while fetching user-specific skills.' });
  }
};

// @route   PUT api/skills/:id/status
// @desc    Update the status of a skill listing (e.g., to completed, closed)
// @access  Private (requires authentication, only owner can update status)
exports.updateSkillStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['active', 'pending', 'completed', 'closed']; 
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided. Must be one of: active, pending, completed, closed.' });
  }

  try {
    let post = await PostS.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Skill listing not found.' });
    }

    if (post.userId.toString() !== req.userId) { // Authorization check
      return res.status(401).json({ message: 'User not authorized to update this skill listing.' });
    }

    // CRITICAL: Update the status and the lastStatusUpdate timestamp
    post.status = status;
    post.lastStatusUpdate = Date.now(); // Record when status was last updated
    
    await post.save();

    // CRITICAL: Return the updated post object so the frontend can use it
    res.status(200).json({ message: `Skill listing status updated to ${status}.`, post });

  } catch (err) {
    console.error('Error updating skill status:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid skill listing ID format.' });
    }
    res.status(500).json({ message: 'Server error during skill status update.' });
  }
};

// @route   DELETE api/skills/:id
// @desc    Delete a skill listing
// @access  Private (requires authentication, only owner can delete)
exports.deleteSkillListing = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await PostS.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Skill listing not found.' });
    }

    // Ensure only the owner can delete the post
    if (post.userId.toString() !== req.userId) {
      return res.status(401).json({ message: 'User not authorized to delete this skill listing.' });
    }

    await PostS.deleteOne({ _id: id }); // Or findByIdAndDelete(id)
    res.status(200).json({ message: 'Skill listing deleted successfully.' });

  } catch (err) {
    console.error('Error deleting skill listing:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid skill listing ID format.' });
    }
    res.status(500).json({ message: 'Server error during skill listing deletion.' });
  }
};
