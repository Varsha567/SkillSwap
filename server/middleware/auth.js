const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token') || req.header('Authorization');

    // Check if not token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Handle Bearer token format if present
    let actualToken = token;
    if (token.startsWith('Bearer ')) {
        actualToken = token.slice(7, token.length);
    }

    // Verify token
    try {
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
        // CRITICAL: Attach the user ID from the token payload to req.userId
        req.userId = decoded.user.id; // Assuming your JWT payload has { user: { id: '...' } }
        console.log('Auth Middleware: Token decoded. User ID:', req.userId); // Add logging here
        next();
    } catch (err) {
        console.error('Auth Middleware: Token verification failed.', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};
