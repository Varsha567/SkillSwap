const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      profileComplete: false // Ensure this is explicitly set for new users
    });

    // Generate token
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET || 'your-secret-key', // Use a strong secret in production!
      { expiresIn: '1h' }
    );

    // FIX HERE: Changed 'user.profileComplete' to 'newUser.profileComplete'
    res.status(201).json({ token, userId: newUser._id, profileComplete: newUser.profileComplete });
  } catch (err) {
    // IMPORTANT: Log the actual error to your backend console for debugging
    console.error('Signup error (backend):', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // You might want to make this error message more generic to prevent enumeration attacks
      // e.g., 'Invalid credentials' for both user not found and password mismatch.
      return res.status(400).json({ message: 'Invalid credentials' }); 
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key', // Use a strong secret in production!
      { expiresIn: '1h' }
    );

    res.status(200).json({ 
      token, 
      userId: user._id,
      profileComplete: user.profileComplete 
    });
  } catch (err) {
    // IMPORTANT: Log the actual error to your backend console for debugging
    console.error('Login error (backend):', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
