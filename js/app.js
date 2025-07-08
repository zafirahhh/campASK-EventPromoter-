// Event data with AI-generated poster concepts
const eventsData = [
    {
        id: 1,
        title: "Tech Innovation Summit",
        description: "Join industry leaders and students for an exciting exploration of cutting-edge technology trends and innovation opportunities.",
        category: "academic",
        date: "2025-07-15",
        time: "14:00",
        venue: "Tech Hub Auditorium",
        poster: "🚀",
        attendees: 150,
        maxAttendees: 200
    },
    {
        id: 2,
        title: "Summer Music Festival",
        description: "An amazing outdoor concert featuring local bands and student performers. Bring your friends and enjoy great music!",
        category: "social",
        date: "2025-07-20",
        time: "18:00",
        venue: "Campus Green",
        poster: "🎵",
        attendees: 300,
        maxAttendees: 500
    },
    {
        id: 3,
        title: "Basketball Championship",
        description: "Cheer for our university team in the final championship game. Free snacks and drinks for all attendees!",
        category: "sports",
        date: "2025-07-25",
        time: "19:30",
        venue: "Sports Complex",
        poster: "🏀",
        attendees: 400,
        maxAttendees: 600
    },
    {
        id: 4,
        title: "Career Development Workshop",
        description: "Learn essential skills for job interviews, resume writing, and networking. Industry professionals will share their insights.",
        category: "academic",
        date: "2025-07-18",
        time: "10:00",
        venue: "Business Building Room 201",
        poster: "💼",
        attendees: 75,
        maxAttendees: 100
    },
    {
        id: 5,
        title: "International Food Fair",
        description: "Taste delicious cuisines from around the world prepared by our international student community.",
        category: "social",
        date: "2025-07-22",
        time: "12:00",
        venue: "Student Union Plaza",
        poster: "🌍",
        attendees: 200,
        maxAttendees: 300
    },
    {
        id: 6,
        title: "Swimming Competition",
        description: "Join us for an exciting swimming competition open to all skill levels. Medals and prizes for winners!",
        category: "sports",
        date: "2025-07-28",
        time: "16:00",
        venue: "Aquatic Center",
        poster: "🏊",
        attendees: 80,
        maxAttendees: 120
    }
];

// DOM elements
const eventsGrid = document.getElementById('eventsGrid');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const applicationForm = document.getElementById('applicationForm');
const cancelBtn = document.getElementById('cancelBtn');
const notification = document.getElementById('notification');
const filterBtns = document.querySelectorAll('.filter-btn');

// Chat elements
const chatBubble = document.getElementById('chatBubble');
const chatWindow = document.getElementById('chatWindow');
const chatClose = document.getElementById('chatClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');
const quickActionBtns = document.querySelectorAll('.quick-action-btn');

// Application management elements
const viewApplicationsBtn = document.getElementById('viewApplicationsBtn');
const backToEventsBtn = document.getElementById('backToEvents');
const eventsSection = document.querySelector('.events-section');
const applicationsSection = document.getElementById('applicationsSection');
const applicationsContainer = document.getElementById('applicationsContainer');
const applicationsBadge = document.getElementById('applicationsBadge');
const noApplications = document.getElementById('noApplications');

// Edit modal elements
const editModalOverlay = document.getElementById('editModalOverlay');
const editModalClose = document.getElementById('editModalClose');
const editApplicationForm = document.getElementById('editApplicationForm');
const editCancelBtn = document.getElementById('editCancelBtn');

// Current state
let currentFilter = 'all';
let currentEventId = null;
let isChatOpen = false;
let currentApplicationId = null;
let userApplications = JSON.parse(localStorage.getItem('userApplications')) || [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    renderEvents();
    setupEventListeners();
    updateApplicationsBadge();
    
    // Initialize chat send button state
    if (chatSend) {
        chatSend.disabled = true;
    }
    
    animateOnLoad();
});

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', handleFilter);
    });

    // Modal controls
    modalClose.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', handleModalOverlayClick);

    // Form submission
    applicationForm.addEventListener('submit', handleFormSubmit);

    // Application management
    viewApplicationsBtn.addEventListener('click', showApplications);
    backToEventsBtn.addEventListener('click', showEvents);

    // Edit modal controls
    editModalClose.addEventListener('click', closeEditModal);
    editCancelBtn.addEventListener('click', closeEditModal);
    editModalOverlay.addEventListener('click', handleEditModalOverlayClick);
    editApplicationForm.addEventListener('submit', handleEditFormSubmit);

    // Chat controls
    chatBubble.addEventListener('click', toggleChat);
    chatClose.addEventListener('click', closeChat);
    chatSend.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', handleChatKeyPress);
    chatInput.addEventListener('input', handleChatInput);

    // Quick action buttons
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', handleQuickAction);
    });

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyDown);
}

// Handle filter button clicks
function handleFilter(e) {
    const filter = e.target.dataset.filter;
    
    // Update active filter button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    currentFilter = filter;
    renderEvents();
}

// Render events based on current filter
function renderEvents() {
    const filteredEvents = currentFilter === 'all' 
        ? eventsData 
        : eventsData.filter(event => event.category === currentFilter);

    eventsGrid.innerHTML = '';

    if (filteredEvents.length === 0) {
        eventsGrid.innerHTML = `
            <div class="no-events">
                <h3>No events found</h3>
                <p>Try selecting a different category.</p>
            </div>
        `;
        return;
    }

    filteredEvents.forEach(event => {
        const eventCard = createEventCard(event);
        eventsGrid.appendChild(eventCard);
    });

    // Add fade-in animation
    document.querySelectorAll('.event-card').forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in');
        }, index * 100);
    });
}

// Create event card HTML
function createEventCard(event) {
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const formattedTime = formatTime(event.time);
    const spotsLeft = event.maxAttendees - event.attendees;
    const isAlmostFull = spotsLeft <= 20;

    const cardElement = document.createElement('div');
    cardElement.className = 'event-card';
    cardElement.innerHTML = `
        <div class="event-image">
            ${event.poster}
        </div>
        <div class="event-content">
            <span class="event-category">${event.category}</span>
            <h3 class="event-title">${event.title}</h3>
            <p class="event-description">${event.description}</p>
            
            <div class="event-details">
                <div class="event-detail">
                    <i class="fas fa-calendar"></i>
                    <span>${formattedDate}</span>
                </div>
                <div class="event-detail">
                    <i class="fas fa-clock"></i>
                    <span>${formattedTime}</span>
                </div>
                <div class="event-detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${event.venue}</span>
                </div>
                <div class="event-detail">
                    <i class="fas fa-users"></i>
                    <span>${event.attendees}/${event.maxAttendees} attendees</span>
                    ${isAlmostFull ? '<span style="color: var(--secondary-color); font-weight: 500; margin-left: 0.5rem;">Almost Full!</span>' : ''}
                </div>
            </div>

            <div class="event-actions">
                <button class="btn btn-primary" onclick="openApplicationModal(${event.id})">
                    <i class="fas fa-user-plus"></i>
                    Join Now
                </button>
                <button class="btn btn-secondary" onclick="setReminder(${event.id})">
                    <i class="fas fa-bell"></i>
                    Set Reminder
                </button>
                <button class="btn btn-outline" onclick="shareEvent(${event.id})">
                    <i class="fas fa-share"></i>
                    Share
                </button>
            </div>
        </div>
    `;

    return cardElement;
}

// Format time to 12-hour format
function formatTime(time24) {
    const [hours, minutes] = time24.split(':');
    const hour12 = ((parseInt(hours) + 11) % 12) + 1;
    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
}

// Open application modal
function openApplicationModal(eventId) {
    currentEventId = eventId;
    const event = eventsData.find(e => e.id === eventId);
    
    if (event) {
        document.querySelector('.modal-title').textContent = `Join ${event.title}`;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus on first input for accessibility
        setTimeout(() => {
            document.getElementById('studentName').focus();
        }, 300);
    }
}

// Close modal
function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    applicationForm.reset();
    currentEventId = null;
}

// Close edit modal
function closeEditModal() {
    editModalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentApplicationId = null;
}

// Handle modal overlay click
function handleModalOverlayClick(e) {
    if (e.target === modalOverlay) {
        closeModal();
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(applicationForm);
    const applicationData = {
        eventId: currentEventId,
        name: formData.get('studentName'),
        email: formData.get('studentEmail'),
        notes: formData.get('studentNotes')
    };

    // Simulate form submission
    submitApplication(applicationData);
}

// Simulate application submission
function submitApplication(data) {
    // Show loading state
    const submitBtn = applicationForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        const event = eventsData.find(e => e.id === data.eventId);
        if (event) {
            event.attendees += 1;
            
            // Add to user applications
            const application = {
                id: Date.now(),
                eventId: data.eventId,
                eventTitle: event.title,
                eventDate: event.date,
                eventTime: event.time,
                eventVenue: event.venue,
                name: data.name,
                email: data.email,
                notes: data.notes,
                status: 'confirmed',
                appliedAt: new Date().toISOString()
            };
            
            userApplications.push(application);
            localStorage.setItem('userApplications', JSON.stringify(userApplications));
        }

        closeModal();
        showNotification(`Successfully registered for ${event.title}!`);
        renderEvents(); // Re-render to update attendee count
        updateApplicationsBadge();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

// Application Management Functions
function showApplications() {
    eventsSection.style.display = 'none';
    applicationsSection.style.display = 'block';
    renderApplications();
}

function showEvents() {
    applicationsSection.style.display = 'none';
    eventsSection.style.display = 'block';
}

function renderApplications() {
    if (userApplications.length === 0) {
        noApplications.style.display = 'block';
        applicationsContainer.innerHTML = '';
        applicationsContainer.appendChild(noApplications);
        return;
    }

    noApplications.style.display = 'none';
    applicationsContainer.innerHTML = '';

    userApplications.forEach(application => {
        const applicationCard = createApplicationCard(application);
        applicationsContainer.appendChild(applicationCard);
    });
}

function createApplicationCard(application) {
    const cardElement = document.createElement('div');
    cardElement.className = 'application-card';
    
    const eventDate = new Date(application.eventDate);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const formattedTime = formatTime(application.eventTime);
    const appliedDate = new Date(application.appliedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    cardElement.innerHTML = `
        <div class="application-header">
            <div class="application-event-info">
                <h4>${application.eventTitle}</h4>
            </div>
            <span class="application-status ${application.status}">${application.status.toUpperCase()}</span>
        </div>
        <div class="application-body">
            <div class="application-details">
                <div class="application-detail">
                    <strong>Date:</strong>
                    <span>${formattedDate}</span>
                </div>
                <div class="application-detail">
                    <strong>Time:</strong>
                    <span>${formattedTime}</span>
                </div>
                <div class="application-detail">
                    <strong>Venue:</strong>
                    <span>${application.eventVenue}</span>
                </div>
                <div class="application-detail">
                    <strong>Name:</strong>
                    <span>${application.name}</span>
                </div>
                <div class="application-detail">
                    <strong>Email:</strong>
                    <span>${application.email}</span>
                </div>
                ${application.notes ? `
                <div class="application-detail">
                    <strong>Notes:</strong>
                    <span>${application.notes}</span>
                </div>
                ` : ''}
                <div class="application-detail">
                    <strong>Applied:</strong>
                    <span>${appliedDate}</span>
                </div>
            </div>
            <div class="application-actions">
                <button class="btn btn-secondary" onclick="editApplication(${application.id})">
                    <i class="fas fa-edit"></i>
                    Edit
                </button>
                <button class="btn btn-outline" onclick="deleteApplication(${application.id})">
                    <i class="fas fa-trash"></i>
                    Delete
                </button>
                <button class="btn btn-primary" onclick="setReminder(${application.eventId})">
                    <i class="fas fa-bell"></i>
                    Set Reminder
                </button>
            </div>
        </div>
    `;

    return cardElement;
}

function updateApplicationsBadge() {
    applicationsBadge.textContent = userApplications.length;
    if (userApplications.length === 0) {
        applicationsBadge.style.display = 'none';
    } else {
        applicationsBadge.style.display = 'inline-block';
    }
}

function editApplication(applicationId) {
    const application = userApplications.find(app => app.id === applicationId);
    if (!application) return;

    currentApplicationId = applicationId;
    
    // Populate edit form
    document.getElementById('editStudentName').value = application.name;
    document.getElementById('editStudentEmail').value = application.email;
    document.getElementById('editStudentNotes').value = application.notes || '';
    
    // Update modal title
    document.querySelector('#editModalOverlay .modal-title').textContent = `Edit Application - ${application.eventTitle}`;
    
    editModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        document.getElementById('editStudentName').focus();
    }, 300);
}

function closeEditModal() {
    editModalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    editApplicationForm.reset();
    currentApplicationId = null;
}

function handleEditModalOverlayClick(e) {
    if (e.target === editModalOverlay) {
        closeEditModal();
    }
}

function handleEditFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(editApplicationForm);
    const updatedData = {
        name: formData.get('editStudentName'),
        email: formData.get('editStudentEmail'),
        notes: formData.get('editStudentNotes')
    };

    updateApplication(updatedData);
}

function updateApplication(updatedData) {
    const submitBtn = editApplicationForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
    submitBtn.disabled = true;

    setTimeout(() => {
        const applicationIndex = userApplications.findIndex(app => app.id === currentApplicationId);
        if (applicationIndex !== -1) {
            userApplications[applicationIndex] = {
                ...userApplications[applicationIndex],
                ...updatedData
            };
            localStorage.setItem('userApplications', JSON.stringify(userApplications));
        }

        closeEditModal();
        renderApplications();
        showNotification('Application updated successfully!');
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1000);
}

function deleteApplication(applicationId) {
    const application = userApplications.find(app => app.id === applicationId);
    if (!application) return;

    if (confirm(`Are you sure you want to delete your application for "${application.eventTitle}"? This action cannot be undone.`)) {
        // Update event attendee count
        const event = eventsData.find(e => e.id === application.eventId);
        if (event && event.attendees > 0) {
            event.attendees -= 1;
        }

        // Remove from applications
        userApplications = userApplications.filter(app => app.id !== applicationId);
        localStorage.setItem('userApplications', JSON.stringify(userApplications));
        
        renderApplications();
        updateApplicationsBadge();
        renderEvents(); // Update events display
        showNotification('Application deleted successfully');
    }
}

// Close chat window on outside click
document.addEventListener('click', function(event) {
    if (!chatBubble.contains(event.target) && !chatWindow.contains(event.target)) {
        if (isChatOpen) {
            toggleChat();
        }
    }
});

// Animate elements on page load
function animateOnLoad() {
    // Both header and hero are now visible by default
    // No animation needed - content shows immediately
}

// Add initial styles for animation
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    const hero = document.querySelector('.hero');
    
    // Keep both header and hero visible by default
    header.style.transition = 'all 0.6s ease';
    hero.style.transition = 'all 0.6s ease';
});

// Service Worker registration for PWA features (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Service worker registration would go here for offline functionality
        console.log('Event Promoter app loaded successfully!');
    });
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        eventsData,
        formatTime,
        generateCalendarUrl,
        formatDateForCalendar
    };
}

// Handle keyboard navigation
function handleKeyDown(e) {
    // Close modal on Escape key
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
    }
    
    // Close chat on Escape key
    if (e.key === 'Escape' && isChatOpen) {
        closeChat();
    }
}

// Chat Functionality
function toggleChat() {
    if (isChatOpen) {
        closeChat();
    } else {
        openChat();
    }
}

function openChat() {
    chatWindow.classList.add('active');
    chatBubble.style.transform = 'scale(0.8)';
    isChatOpen = true;
    
    // Focus on input for accessibility
    setTimeout(() => {
        chatInput.focus();
    }, 300);
}

function closeChat() {
    chatWindow.classList.remove('active');
    chatBubble.style.transform = 'scale(1)';
    isChatOpen = false;
}

function handleChatKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendChatMessage();
    }
}

function handleChatInput(e) {
    const hasText = e.target.value.trim().length > 0;
    chatSend.disabled = !hasText;
}

function sendChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message
    addChatMessage(message, 'user');
    
    // Clear input
    chatInput.value = '';
    chatSend.disabled = true;

    // Show typing indicator
    showTypingIndicator();

    // Generate bot response
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateBotResponse(message);
        addChatMessage(response, 'bot');
    }, 1000 + Math.random() * 1000); // Random delay for realism
}

function handleQuickAction(e) {
    const message = e.target.dataset.message;
    chatInput.value = message;
    sendChatMessage();
}

function addChatMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    
    const avatar = sender === 'user' ? '👤' : '🤖';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;

    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Add typing animation CSS if not already added
    if (!document.querySelector('#typingCSS')) {
        const style = document.createElement('style');
        style.id = 'typingCSS';
        style.textContent = `
            .typing-dots {
                display: flex;
                gap: 4px;
                padding: 8px 0;
            }
            .typing-dots span {
                width: 8px;
                height: 8px;
                background: var(--text-light);
                border-radius: 50%;
                animation: typing 1.4s infinite ease-in-out;
            }
            .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
            .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
            .typing-dots span:nth-child(3) { animation-delay: 0; }
            @keyframes typing {
                0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                40% { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Event-related responses
    if (message.includes('event') || message.includes('upcoming')) {
        const upcomingEvents = eventsData.slice(0, 3);
        let response = "Here are some upcoming events you might be interested in:\n\n";
        upcomingEvents.forEach(event => {
            const eventDate = new Date(event.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
            response += `📅 ${event.title} - ${eventDate} at ${event.venue}\n`;
        });
        response += "\nYou can scroll up to see all events and click 'Join Now' to register!";
        return response;
    }
    
    // Registration help
    if (message.includes('register') || message.includes('join') || message.includes('sign up')) {
        return "To register for an event:\n\n1. Find an event you like\n2. Click the 'Join Now' button\n3. Fill out the registration form with your name and email\n4. Add any special notes (optional)\n5. Submit your application\n\nYou'll get a confirmation notification once registered! 🎉";
    }
    
    // Reminder help
    if (message.includes('reminder') || message.includes('calendar') || message.includes('notification')) {
        return "I can help you set reminders! 📲\n\nFor any event, click the 'Set Reminder' button to:\n• Add the event to your calendar (Google Calendar)\n• Enable browser notifications (if you allow them)\n• Get notified 1 hour before the event\n\nThis way you'll never miss an event you're excited about!";
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
        const academicEvents = eventsData.filter(event => event.category === 'academic');
        if (academicEvents.length > 0) {
            return `Great! We have ${academicEvents.length} academic events coming up, including workshops, seminars, and career development sessions. Check out the 'Academic' filter above to see them all! 📚`;
        }
    }
    
    if (message.includes('social') || message.includes('fun') || message.includes('party')) {
        const socialEvents = eventsData.filter(event => event.category === 'social');
        if (socialEvents.length > 0) {
            return `Awesome! We have ${socialEvents.length} social events where you can meet new people and have fun! Use the 'Social' filter to see all the exciting social gatherings. 🎉`;
        }
    }
    
    if (message.includes('sport') || message.includes('game') || message.includes('competition')) {
        const sportsEvents = eventsData.filter(event => event.category === 'sports');
        if (sportsEvents.length > 0) {
            return `Perfect! We have ${sportsEvents.length} sports events including games and competitions. Click the 'Sports' filter to see all athletic events. Whether you want to play or cheer, there's something for you! ⚽`;
        }
    }
    
    // Help and general info
    if (message.includes('help') || message.includes('what can you do')) {
        return "I'm your campus assistant! Here's how I can help:\n\n🎯 Find events that match your interests\n📝 Guide you through registration\n⏰ Help set up reminders\n🎓 Provide campus information\n📱 Answer questions about our platform\n\nJust ask me anything about campus events or student life!";
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

// Set reminder functionality
function setReminder(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return;

    // Create calendar event
    const startDate = new Date(`${event.date}T${event.time}`);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration

    const calendarUrl = generateCalendarUrl({
        title: event.title,
        description: event.description,
        location: event.venue,
        startDate: startDate,
        endDate: endDate
    });

    // Try to open calendar application or show fallback
    if (navigator.userAgent.includes('Mobile')) {
        window.open(calendarUrl, '_blank');
    } else {
        // For desktop, simulate local notification permission
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    scheduleNotification(event);
                } else {
                    window.open(calendarUrl, '_blank');
                }
            });
        } else {
            window.open(calendarUrl, '_blank');
        }
    }

    showNotification(`Reminder set for ${event.title}!`);
}

// Generate calendar URL (Google Calendar)
function generateCalendarUrl(eventDetails) {
    const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
    const params = new URLSearchParams({
        text: eventDetails.title,
        details: eventDetails.description,
        location: eventDetails.location,
        dates: `${formatDateForCalendar(eventDetails.startDate)}/${formatDateForCalendar(eventDetails.endDate)}`
    });

    return `${baseUrl}&${params.toString()}`;
}

// Format date for calendar URL
function formatDateForCalendar(date) {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

// Schedule local notification (simulation)
function scheduleNotification(event) {
    const eventDate = new Date(`${event.date}T${event.time}`);
    const notificationTime = new Date(eventDate.getTime() - 60 * 60 * 1000); // 1 hour before
    
    // Simulate notification scheduling
    console.log(`Notification scheduled for ${notificationTime.toLocaleString()}`);
    
    // For demo purposes, show immediate notification
    setTimeout(() => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Upcoming Event: ${event.title}`, {
                body: `Starting in 1 hour at ${event.venue}`,
                icon: '/favicon.ico'
            });
        }
    }, 3000);
}

// Share event functionality
function shareEvent(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return;

    const shareData = {
        title: event.title,
        text: `Check out this amazing event: ${event.title}`,
        url: window.location.href
    };

    // Use Web Share API if available
    if (navigator.share) {
        navigator.share(shareData).catch(err => {
            console.log('Error sharing:', err);
            fallbackShare(event);
        });
    } else {
        fallbackShare(event);
    }
}

// Fallback share functionality
function fallbackShare(event) {
    const shareText = `Check out this amazing event: ${event.title} on ${event.date} at ${event.venue}. ${window.location.href}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Event link copied to clipboard!');
        });
    } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = shareText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('Event link copied to clipboard!');
    }
}

// Show notification
function showNotification(message) {
    const notificationText = notification.querySelector('.notification-text');
    notificationText.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}
