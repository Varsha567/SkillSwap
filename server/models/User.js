const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: String,
  skills: [String],
  needs: [String], // What they want to learn
  discordHandle: String,
  profilePicUrl: String, // Optional profile pic (URL)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
