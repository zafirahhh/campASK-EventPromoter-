const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Chatbot API endpoint
app.post('/api/chat', (req, res) => {
    const { message } = req.body;
    
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }
    
    // Generate bot response (same logic as your current client-side chatbot)
    const response = generateBotResponse(message.toLowerCase());
    
    res.json({ 
        response: response,
        timestamp: new Date().toISOString()
    });
});

// Bot response generation function (moved from client-side)
function generateBotResponse(message) {
    // Sample events data for server-side responses
    const eventsCount = {
        total: 8,
        academic: 3,
        social: 3,
        sports: 2
    };
    
    // Event-related responses
    if (message.includes('event') || message.includes('upcoming')) {
        return `Here are some upcoming events you might be interested in:

📅 Tech Innovation Summit - Jul 15 at Tech Hub Auditorium
📅 Summer Music Festival - Jul 20 at Campus Green
📅 Basketball Championship - Jul 25 at Sports Complex

You can scroll up to see all events and click 'Join Now' to register!`;
    }
    
    // Registration help
    if (message.includes('register') || message.includes('join') || message.includes('sign up')) {
        return `To register for an event:

1. Find an event you like
2. Click the 'Join Now' button
3. Fill out the registration form with your name and email
4. Add any special notes (optional)
5. Submit your application

You'll get a confirmation notification once registered! 🎉`;
    }
    
    // Reminder help
    if (message.includes('reminder') || message.includes('calendar') || message.includes('notification')) {
        return `I can help you set reminders! 📲

For any event, click the 'Set Reminder' button to:
• Add the event to your calendar (Google Calendar)
• Enable browser notifications (if you allow them)
• Get notified 1 hour before the event

This way you'll never miss an event you're excited about!`;
    }
    
    // Greeting responses
    if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
        return "Hello there! 👋 Welcome to Event Promoter! I'm here to help you discover amazing campus events and make the most of your student life. What can I help you with today?";
    }
    
    // Thank you responses
    if (message.includes('thank') || message.includes('thanks')) {
        return "You're very welcome! 😊 I'm always here to help you stay connected with campus life. Is there anything else you'd like to know about our events?";
    }
    
    // Category-specific help
    if (message.includes('academic') || message.includes('study') || message.includes('career')) {
        return `Great! We have ${eventsCount.academic} academic events coming up, including workshops, seminars, and career development sessions. Check out the 'Academic' filter above to see them all! 📚`;
    }
    
    if (message.includes('social') || message.includes('fun') || message.includes('party')) {
        return `Awesome! We have ${eventsCount.social} social events where you can meet new people and have fun! Use the 'Social' filter to see all the exciting social gatherings. 🎉`;
    }
    
    if (message.includes('sport') || message.includes('game') || message.includes('competition')) {
        return `Perfect! We have ${eventsCount.sports} sports events including games and competitions. Click the 'Sports' filter to see all athletic events. Whether you want to play or cheer, there's something for you! ⚽`;
    }
    
    // Help and general info
    if (message.includes('help') || message.includes('what can you do')) {
        return `I'm your campus assistant! Here's how I can help:

🎯 Find events that match your interests
📝 Guide you through registration
⏰ Help set up reminders
🎓 Provide campus information
📱 Answer questions about our platform

Just ask me anything about campus events or student life!`;
    }
    
    // Default responses for unrecognized input
    const defaultResponses = [
        "That's interesting! Is there anything specific about campus events I can help you with? 🤔",
        "I'd love to help! Could you tell me more about what you're looking for? Maybe an event type or specific question?",
        "Great question! I'm here to help with anything related to campus events. What would you like to know? 🎓",
        "I'm still learning! For now, I'm best at helping with event information, registration, and reminders. What can I help you with?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Event Promoter server running on port ${PORT}`);
    console.log(`🌐 Access your app at: http://localhost:${PORT}`);
});
