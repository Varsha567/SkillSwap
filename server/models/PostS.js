const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true // Trim whitespace
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['🎨 Design', '💻 Programming', '🎸 Music', '🧘 Yoga', '🌐 Language Exchange', '📚 Academics'],
    required: true
  },
  skillLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Expert'],
    default: 'Beginner'
  },
  swapFor: { 
    type: String, 
    required: true,
    trim: true // Trim whitespace
  },
  userId: { // Reference to the User who posted this skill
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  username: { // Denormalized username for easier display on frontend
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active','pending','completed', 'closed'],
    default: 'active'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  lastStatusUpdate: { // When the status was last changed or post was created/edited
        type: Date,
        default: Date.now
    },
  reminderCount: { // How many reminders have been sent for this post
        type: Number,
        default: 0
    },
  lastReminderSentAt: { // When the last reminder was sent
        type: Date
    }
});

postSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 }); // 30 days in seconds

module.exports = mongoose.model('PostS', postSchema);
  