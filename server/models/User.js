const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing
const crypto = require('crypto'); // For generating reset tokens

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please add a username'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters'],
        match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ],
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        // Password is not required for Google-authenticated users
        // This makes it optional for users who sign up via Google
        required: function() {
            return !this.googleId;
        },
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Do not return password by default in queries
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows null values, so multiple documents can have null googleId
    },
    profileComplete: {
        type: Boolean,
        default: false
    },
    fullName: {
        type: String,
        trim: true,
        maxlength: [100, 'Full name cannot exceed 100 characters']
    },
    bio: {
        type: String,
        trim: true,
        maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    skillsOffered: [{ type: String }], 
    skillsNeeded: [{ type: String }], 
    discordHandle: {
        type: String,
        trim: true,
        maxlength: [50, 'Discord handle cannot exceed 50 characters']
    },
    // NEW: Fields for password reset
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    preferences: {
        receiveEmailReminders: {
            type: Boolean,
            default: true // Users receive reminders by default
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving (only if password field is modified or new)
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
    // Only try to compare if a password exists (manual login)
    if (!this.password) {
        return false;
    }
    return await bcrypt.compare(enteredPassword, this.password);
};

// NEW: Generate and hash password reset token
userSchema.methods.getResetPasswordToken = function() {
    // Generate token (random bytes converted to hex string)
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire time (e.g., 10 minutes from now)
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken; // Return the unhashed token to be sent in the email
};

userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false; // No password for Google users
  return await bcrypt.compare(candidatePassword, this.password);
};


module.exports = mongoose.model('User', userSchema);
