const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileComplete: { type: Boolean, default: false },
  fullName: { type: String },
  bio: String,
  skillsOffered: [{ type: String }], 
  skillsNeeded: [{ type: String }], 
  discordHandle: String,
  profilePicUrl: String, // Optional profile pic (URL)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
