import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../css/ChatbotWidget.css'; // Import the CSS

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]); // Stores { type: 'user' | 'ai', text: 'message' }
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false); // State for AI typing indicator
    const messagesEndRef = useRef(null); // Ref for auto-scrolling messages

    // Auto-scroll to the latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Scroll to bottom whenever messages update or typing status changes
    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Toggle chat window visibility
    const toggleChat = useCallback(() => {
        setIsOpen(prev => !prev);
        // Reset messages and state when closing for a fresh start
        if (isOpen) {
            setMessages([]);
            setIsTyping(false);
            setInputMessage('');
        } else {
            // Initial greeting when opening chat
            setMessages([{ type: 'ai', text: "Hello! I'm SkillSwap's AI Assistant. How can I help you today?" }]);
        }
    }, [isOpen]);

    // Handle sending a message and getting AI response
    const handleSendMessage = async (e) => {
        e.preventDefault();
        const trimmedMessage = inputMessage.trim();
        if (!trimmedMessage) return;

        const newUserMessage = { type: 'user', text: trimmedMessage };
        // Add user message to state
        setMessages(prev => [...prev, newUserMessage]);
        setInputMessage('');
        setIsTyping(true); // Show typing indicator

        try {
            // Prepare chat history to send to backend (excluding the initial AI greeting)
            const chatHistoryForAPI = messages.slice(1).map(msg => ({ // Skip the very first AI greeting if it's generic
                type: msg.type === 'ai' ? 'ai' : 'user', // Map 'ai' to 'model' for Gemini
                text: msg.text
            }));
            
            // Add the current user message to the history for context
            chatHistoryForAPI.push({ type: 'user', text: trimmedMessage });

            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chat/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: trimmedMessage,
                    chatHistory: chatHistoryForAPI // Send the history
                }),
            });

            const data = await response.json();

            if (response.ok) {
                const aiResponse = { type: 'ai', text: data.response };
                setMessages(prev => [...prev, aiResponse]);
            } else {
                console.error('API Error:', data.message || 'Failed to get response from AI.');
                const errorResponse = { type: 'ai', text: data.message || 'Sorry, I encountered an error. Please try again.' };
                setMessages(prev => [...prev, errorResponse]);
            }
        } catch (error) {
            console.error('Network/Fetch Error:', error);
            const networkError = { type: 'ai', text: 'Oops! I can\'t connect right now. Please check your internet connection or try again later.' };
            setMessages(prev => [...prev, networkError]);
        } finally {
            setIsTyping(false); // Hide typing indicator regardless of success or failure
        }
    };

    return (
        <div className="chatbot-container">
            {/* Chat Window */}
            <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
                <div className="chatbot-header">
                    SkillSwap AI Assistant
                    <button onClick={toggleChat} aria-label="Close Chat">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="chatbot-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message-bubble ${msg.type}`}>
                            {msg.text}
                        </div>
                    ))}
                    {isTyping && (
                        <div className="typing-indicator message-bubble ai">
                            <span></span><span></span><span></span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <form className="chatbot-input-area" onSubmit={handleSendMessage}>
                    <textarea
                        className="chatbot-input"
                        placeholder="Type your message..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                        rows={1}
                        style={{ height: 'auto', minHeight: '40px' }}
                    />
                    <button type="submit" className="chatbot-send-button" disabled={isTyping || !inputMessage.trim()}>
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </form>
            </div>

            {/* Toggle Button */}
            <button
                className="chatbot-toggle-button"
                onClick={toggleChat}
                aria-label={isOpen ? "Close Chatbot" : "Open Chatbot"}
            >
                {isOpen ? (
                    <i className="fas fa-comment-dots"></i>
                ) : (
                    <i className="fas fa-robot"></i>
                )}
            </button>
        </div>
    );
};

export default ChatbotWidget;
