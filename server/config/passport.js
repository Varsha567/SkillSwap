const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

// Serialize user: What data to store in the session (not strictly needed for JWTs but good practice)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user: Retrieve user from session (not strictly needed for JWTs)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists in your DB based on Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // User already exists, return the user
          return done(null, user);
        } else {
          // No user with this Google ID, check if email exists (for linking accounts)
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // Email exists but not linked to Google. Decide how to handle:
            // 1. Link the Google ID to the existing account:
            user.googleId = profile.id;
            await user.save();
            return done(null, user);
            // 2. Or, tell user to log in with password or handle merging.
            // For simplicity, linking is often chosen if no password exists.
            // If a password exists and you don't want to overwrite, you might
            // return an error or prompt the user.
            // For now, let's assume we link if email matches.
            // If you want to force distinct accounts for same email unless linked by user:
            // return done(new Error('Email already registered with another method. Please log in with your existing account.'), null);
          } else {
            // No user found with Google ID or email, create a new user
            const newUser = new User({
              googleId: profile.id,
              username: profile.displayName.replace(/\s/g, '').toLowerCase() + Math.floor(Math.random() * 10000), // Generate a unique username
              email: profile.emails[0].value,
              fullName: profile.displayName,
              // No password for Google authenticated users
              profileComplete: true, // Can set this true if basic profile is considered complete
            });
            const savedUser = await newUser.save();
            return done(null, savedUser);
          }
        }
      } catch (err) {
        console.error('Error in GoogleStrategy callback:', err);
        return done(err, null);
      }
    }
  )
);