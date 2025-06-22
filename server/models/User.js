const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   username: {
    type: String,
    required: function() { return !this.googleId; }, // Required if not Google user
    unique: true,
    sparse: true // Allows null values if not unique for traditional users
  },
  email: {
    type: String,
    required: true, // Email is always required
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Please fill a valid email address']
  },
  googleId: { // New field for Google users
    type: String,
    unique: true,
    sparse: true // Allows null values for non-Google users, but ensures uniqueness for Google users
  },
  password: {
    type: String,
    required: function() { return !this.googleId; } // Required only if not Google user
  },
  profileComplete: { type: Boolean, default: false },
  fullName: { type: String },
  bio: String,
  skillsOffered: [{ type: String }], 
  skillsNeeded: [{ type: String }], 
  discordHandle: String,
  profilePicUrl: String, // Optional profile pic (URL)
  createdAt: { type: Date, default: Date.now },
  preferences: {
        receiveEmailReminders: {
            type: Boolean,
            default: true
        }
    }
});
userSchema.pre('save', async function(next) {
  if (this.isModified('password') && this.password) { // Only hash if password exists and is modified
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Optional: Method to compare password (only for non-Google users)
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false; // No password for Google users
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
