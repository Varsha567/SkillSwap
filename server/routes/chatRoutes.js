const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController'); // We'll create this next
const auth = require('../middleware/auth'); // Optionally protect the endpoint

// @route   POST /api/chat/generate
// @desc    Send a message to the AI chatbot and get a response
// @access  Public (or Private, if you want only logged-in users to chat)
// For now, let's keep it public so anyone can use the chatbot.
router.post('/generate', chatController.generateChatResponse);

module.exports = router;
