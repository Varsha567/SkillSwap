const fetch = require('node-fetch');
require('dotenv').config(); // Make sure dotenv is configured to load .env variables

// Define your SkillSwap knowledge base as a string
const SKILLSWAP_KNOWLEDGE_BASE = `
SkillSwap is a platform for peer-to-peer skill exchange. Users can either 'offer' a skill they possess or 'request' a skill they want to learn.
Key features:
- Users create profiles, which can be completed with a bio, skills offered, skills needed, and Discord handle.
- Users can post new skill listings (offers or requests) including a title, description, category (e.g., Design, Programming, Music, Yoga, Language Exchange, Academics), skill level (Beginner, Intermediate, Expert), and what they 'swapFor'.
- Listings have a status: 'active' (visible, open for exchange), 'pending' (someone has expressed interest), 'completed' (exchange finished), 'closed' (listing manually taken down).
- The 'Browse Skills' page allows users to discover available skill listings.
- The 'My Profile' page allows logged-in users to manage their own profile and their posted skill listings.
- Automated email reminders are sent for 'active' posts that haven't had a status update in some time.
- Users can contact each other through their provided Discord handle.
- To use the full features, users need to register or log in.
- This chatbot is designed to assist with SkillSwap-related inquiries.
`;

// @desc    Send a message to the AI chatbot and get a response
// @route   POST /api/chat/generate
// @access  Public
exports.generateChatResponse = async (req, res) => {
    const { message, chatHistory } = req.body;

    if (!message) {
        return res.status(400).json({ message: 'Message is required.' });
    }

    let contents = [
        {
            role: 'user',
            parts: [{ text: `You are a helpful AI assistant for the SkillSwap platform. Your primary goal is to answer questions about SkillSwap based on the provided information. If a question is outside the scope of SkillSwap, kindly state that you are limited to SkillSwap-related topics.

            Here is information about SkillSwap:
            ${SKILLSWAP_KNOWLEDGE_BASE}

            Now, please answer the user's question.` }]
        },
        {
            role: 'model',
            parts: [{ text: "Understood. I am ready to assist with SkillSwap inquiries." }]
        }
    ];

    if (chatHistory && Array.isArray(chatHistory)) {
        chatHistory.forEach(msg => {
            if (msg.type === 'user') {
                contents.push({ role: 'user', parts: [{ text: msg.text }] });
            } else if (msg.type === 'ai') {
                // Ensure the role for AI is 'model' as per Gemini API
                contents.push({ role: 'model', parts: [{ text: msg.text }] });
            }
        });
    }

    contents.push({ role: 'user', parts: [{ text: message }] });

    const payload = {
        contents: contents
    };

    // Use the API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY; 

    if (!apiKey) {
        console.error("GEMINI_API_KEY is not set in environment variables.");
        return res.status(500).json({ message: "AI service is not configured. Missing API Key." });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
        console.log('Sending request to Gemini API...');
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API Error Response:', errorData);
            return res.status(response.status).json({
                message: errorData.error?.message || 'Error from AI service.',
                details: errorData
            });
        }

        const result = await response.json();
        
        let aiText = 'Sorry, I could not generate a response. Please try again or rephrase your question.';

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            aiText = result.candidates[0].content.parts[0].text;
            console.log('Gemini API Success Response (with context):', aiText);
        } else {
            console.warn('Gemini API: Unexpected response structure or no content.', result);
            aiText = 'I am having trouble understanding. Could you please rephrase or ask a different question about SkillSwap?';
        }

        res.json({ response: aiText });

    } catch (error) {
        console.error('Error connecting to Gemini API:', error);
        res.status(500).json({ message: 'Internal server error while contacting AI service.' });
    }
};
