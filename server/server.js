const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const skillRoutes = require('./routes/skillRoutes');
const connectDB = require('./config/db');
// FIX: Changed 'postRemainder' back to 'postReminders' to match actual filename
const setupPostReminderCron = require('./cronJobs/postReminders'); 
const passport = require('passport');

// Import your Passport configuration - this file sets up your strategies
// You should call the passport config function here with passport object
require('./config/passport')(passport); // Corrected this line to pass passport object

const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', 
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(passport.initialize()); 
app.use(passport.session());

// Database connection
connectDB();

// Start cron jobs
// Ensure this is called *after* connectDB if cron jobs interact with DB
setupPostReminderCron(); 
console.log('Cron jobs for post reminders initialized.');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/auth', require('./routes/authGoogle'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
