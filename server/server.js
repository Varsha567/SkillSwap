const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const skillRoutes = require('./routes/skillRoutes');
const connectDB = require('./config/db');
const setupPostReminderCron = require('./cronJobs/postRemainder'); 
const passport = require('passport'); // Correctly import the main passport module
// Import your Passport configuration - this file sets up your strategies
require('./config/passport');  // Import passport


const dotenv = require('dotenv');
dotenv.config();

const app = express();


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, // Your frontend URL
    methods: ["GET", "POST"]
  }
});

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



// Socket.io connection
io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('join_room', (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});

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
