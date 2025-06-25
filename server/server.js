const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const skillRoutes = require('./routes/skillRoutes');
const connectDB = require('./config/db');
const setupPostReminderCron = require('./cronJobs/postRemainder'); 
const passport = require('passport'); // Correctly import the main passport module

// Import your Passport configuration - this file sets up your strategies
require('./config/passport');  // Import passport
// Import passport configuration
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


app.use(passport.initialize()); 
// Database connection
connectDB();


// Adjust path as needed
setupPostReminderCron(); 
console.log('Cron jobs for post reminders initialized.');

// Routes
app.use('/api/auth', authRoutes);

// Add this with other route middleware
app.use('/api/profile', profileRoutes);

app.use('/api/skills', skillRoutes);
app.use('/api/auth', require('./routes/authGoogle'));
app.use('/api/chat', require('./routes/chatRoutes')); // NEW: Chatbot routes
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));