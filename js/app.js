// Event data with AI-generated poster concepts
let eventsData = [
    {
        id: 1,
        title: "Tech Innovation Summit",
        description: "Join industry leaders and students for an exciting exploration of cutting-edge technology trends and innovation opportunities.",
        category: "academic",
        date: "2025-07-15",
        time: "14:00",
        venue: "LR-W5",
        poster: "🚀",
        attendees: 195,
        maxAttendees: 200
    },
    {
        id: 2,
        title: "Summer Music Festival",
        description: "An amazing outdoor concert featuring local bands and student performers. Bring your friends and enjoy great music!",
        category: "social",
        date: "2025-07-20",
        time: "18:00",
        venue: "Agora (Outside W1)",
        poster: "🎵",
        attendees: 350,
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
        attendees: 405,
        maxAttendees: 600
    },
    {
        id: 4,
        title: "Career Development Workshop",
        description: "Learn essential skills for job interviews, resume writing, and networking. Industry professionals will share their insights.",
        category: "academic",
        date: "2025-07-18",
        time: "10:00",
        venue: "Career Center",
        poster: "💼",
        attendees: 99,
        maxAttendees: 100
    },
    {
        id: 5,
        title: "International Food Fair",
        description: "Taste delicious cuisines from around the world prepared by our international student community.",
        category: "social",
        date: "2025-07-22",
        time: "12:00",
        venue: "South Agora Hall 1",
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
        venue: "Swimming Complex",
        poster: "🏊",
        attendees: 80,
        maxAttendees: 120
    },
    {
        id: 7,
        title: "Art Exhibition",
        description: "Explore stunning artworks from talented students and local artists.",
        category: "social",
        date: "2025-07-30",
        time: "10:00",
        venue: "South Agora Hall 3 and 4",
        poster: "🎨",
        attendees: 50,
        maxAttendees: 50 // Fully booked
    },
    {
        id: 8,
        title: "Coding Bootcamp",
        description: "Learn coding basics and advanced techniques in this hands-on workshop.",
        category: "academic",
        date: "2025-07-31",
        time: "09:00",
        venue: "E61H",
        poster: "💻",
        attendees: 28,
        maxAttendees: 30 // 2 spots left
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

// Ensure localStorage values are applied before rendering
function initializeAttendeeCounts() {
    console.log('Applying attendee counts from localStorage...');
    eventsData.forEach(event => {
        const saved = localStorage.getItem(`event-${event.id}-attendees`);
        if (saved !== null) {
            const savedCount = parseInt(saved);
            console.log(`Event ID ${event.id}: Loading saved count ${savedCount} (was ${event.attendees})`);
            event.attendees = savedCount;
        }
    });
    console.log('Attendee counts initialized from localStorage');
}

// Debugging: Check for overwrites after initialization
function verifyAttendeeCounts() {
    console.log('Verifying attendee counts after initialization...');
    eventsData.forEach(event => {
        const stored = localStorage.getItem(`event-${event.id}-attendees`);
        console.log(`Event ID ${event.id}: Current ${event.attendees}, Stored: ${stored}`);
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing application...');

    // ✅ Only apply saved counts ONCE
    initializeAttendeeCounts(); // loads saved values from localStorage
    verifyAttendeeCounts(); // debug verification

    renderEvents();             // render AFTER initializing
    setupEventListeners();
    updateApplicationsBadge();

    // Disable chat send initially
    if (chatSend) chatSend.disabled = true;

    animateOnLoad();
    console.log('Application initialized successfully.');
});

// Step 3: Register function to increase count and update localStorage
function register(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event || event.attendees >= event.maxAttendees) return;

    event.attendees += 1;
    localStorage.setItem(`event-${event.id}-attendees`, event.attendees);
    renderEvents();
}

// Utility function to debounce calls
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Debounced renderEvents to prevent excessive calls
const debouncedRenderEvents = debounce(renderEvents, 300);

// Update attendee count and re-render events
function updateAttendeeCount(eventId, increment = 1) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event || event.attendees + increment > event.maxAttendees || event.attendees + increment < 0) return;

    event.attendees += increment;
    localStorage.setItem(`event-${event.id}-attendees`, event.attendees);
    debouncedRenderEvents();
}

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

// Ensure attendee counts and statuses are updated correctly in the DOM
// Debugging: Verify specific event updates
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
    const isFull = event.attendees >= event.maxAttendees;
    const isAlmostFull = !isFull && spotsLeft <= 20 && spotsLeft > 0;

    const cardElement = document.createElement('div');
    cardElement.className = 'event-card';
    cardElement.setAttribute('data-id', event.id);
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
                    ${isFull ? '<span style="color: red; font-weight: 600; margin-left: 0.5rem;">• FULLY BOOKED</span>' : 
                      isAlmostFull ? '<span style="color: var(--secondary-color); font-weight: 500; margin-left: 0.5rem;">• Almost Full!</span>' : ''}
                </div>
            </div>

            <div class="event-actions">
                <button class="btn btn-primary ${isFull ? 'disabled' : ''}" ${isFull ? 'disabled' : ''} ${!isFull ? `onclick="openApplicationModal(${event.id})"` : ''} ${isFull ? 'style="pointer-events: none; cursor: not-allowed;"' : ''}>
                    <i class="fas fa-user-plus"></i>
                    ${isFull ? 'Fully Booked' : 'Join Now'}
                </button>
                <button class="btn btn-secondary ${isFull ? 'disabled' : ''}" ${isFull ? 'disabled' : ''} ${!isFull ? `onclick="setReminder(${event.id})"` : ''} ${isFull ? 'style="pointer-events: none; cursor: not-allowed;"' : ''}>
                    <i class="fas fa-bell"></i>
                    ${isFull ? 'Unavailable' : 'Set Reminder'}
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
            
            // Persist updated count
            localStorage.setItem(`event-${event.id}-attendees`, event.attendees);

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
        
        // Automatically redirect to applications page to show the new registration
        setTimeout(() => {
            showApplications();
        }, 1000); // Small delay to let user see the success notification
        
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
        const event = eventsData.find(e => e.id === application.eventId);
        if (event && event.attendees > 0) {
            event.attendees -= 1;

            // Update localStorage to reflect the new count
            localStorage.setItem(`event-${event.id}-attendees`, event.attendees);
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

// Update event availability - integrated into renderEvents()
function updateEventAvailability() {
    eventsData.forEach(event => {
        if (event.attendees >= event.maxAttendees) {
            displayStatus(event.id, "Fully Booked");
            disableRegisterButton(event.id);
        } else if (event.maxAttendees - event.attendees === 1) {
            displayWarning(event.id, "Only 1 spot left!");
        }
    });
}

// Register for an event
function registerEvent(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return;

    if (event.attendees < event.maxAttendees) {
        event.attendees += 1;
        if (event.attendees >= event.maxAttendees) {
            displayStatus(event.id, "Fully Booked");
            disableRegisterButton(event.id);
        }
        renderEvents(); // Re-render events to reflect changes
    }
}

// Debugging: Add logs to helper functions
function displayStatus(id, message) {
    console.log(`Displaying status for event ID ${id}: ${message}`);
    const eventCard = document.querySelector(`.event-card[data-id='${id}']`);
    if (eventCard) {
        const statusLabel = eventCard.querySelector('.event-status');
        if (statusLabel) {
            statusLabel.textContent = message;
            statusLabel.style.color = "red";
        }
    }
}

function disableRegisterButton(id) {
    console.log(`Disabling register button for event ID ${id}`);
    const registerButton = document.querySelector(`.event-card[data-id='${id}'] .btn-primary`);
    if (registerButton) {
        registerButton.disabled = true;
        registerButton.classList.add('disabled');
    }
}

function displayWarning(id, message) {
    console.log(`Displaying warning for event ID ${id}: ${message}`);
    const eventCard = document.querySelector(`.event-card[data-id='${id}']`);
    if (eventCard) {
        const warningBanner = document.createElement('div');
        warningBanner.className = 'warning-banner';
        warningBanner.textContent = message;
        eventCard.insertBefore(warningBanner, eventCard.firstChild);
    }
}

// Call updateEventAvailability on page load - REMOVED to prevent conflicts

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

// Updated generateBotResponse to handle general questions more effectively
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

    // Navigation and directions
    if (message.includes('direction') || message.includes('navigate') || message.includes('how to get') || 
        message.includes('where is') || message.includes('location') || message.includes('map') ||
        message.includes('lr-w5') || message.includes('agora') || message.includes('sports complex') ||
        message.includes('career center') || message.includes('career centre') || message.includes('swimming') ||
        message.includes('e61h') || message.includes('hall')) {
        return getNavigationGuide(message);
    }

    // General questions
    if (message.includes('help') || message.includes('what can you do')) {
        return "I'm your campus assistant! Here's how I can help:\n\n🎯 Find events that match your interests\n📝 Guide you through registration\n⏰ Help set up reminders\n🗺️ Provide campus navigation and directions\n🎓 Share campus information\n📱 Answer questions about our platform\n\nJust ask me anything about campus events, directions, or student life!";
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

// Campus Navigation Guide based on the university map
function getNavigationGuide(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for specific venue requests
    if (lowerMessage.includes('lr-w5') || lowerMessage.includes('lr w5')) {
        return "🏫 **Directions to LR-W5 (Lecture Room)**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and walk straight towards the central area\n2. Head towards the W-Building complex (green area on the map)\n3. LR-W5 is located in the W5 building section\n4. Look for the W5 building signage - it's part of the main academic complex\n\n⏱️ **Estimated walk time:** 3-5 minutes from main entrance\n📋 **Tip:** LR-W5 is commonly used for tech and academic events!";
    }
    
    if (lowerMessage.includes('agora') && !lowerMessage.includes('south') && !lowerMessage.includes('north')) {
        return "🏛️ **Directions to Main Agora (Outside W1)**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and walk straight ahead\n2. The Agora is the large open courtyard area in the center\n3. Look for the outdoor space adjacent to the W1 building\n4. It's the main gathering area - you'll see the open plaza\n\n⏱️ **Estimated walk time:** 2-3 minutes from main entrance\n📋 **Perfect for:** Outdoor concerts, festivals, and social gatherings!";
    }
    
    if (lowerMessage.includes('south agora hall') || (lowerMessage.includes('south') && lowerMessage.includes('hall'))) {
        return "🏢 **Directions to South Agora Halls 1-4**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and head towards the central Agora area\n2. From the main Agora, walk towards the southern section\n3. Look for the building complex labeled 'South Agora Halls'\n4. Halls 1-4 are numbered and clearly marked\n5. Hall 1 is closest to the main Agora, Hall 4 is furthest south\n\n⏱️ **Estimated walk time:** 4-6 minutes from main entrance\n📋 **Great for:** Art exhibitions, food fairs, and indoor social events!";
    }
    
    if (lowerMessage.includes('north agora hall') || (lowerMessage.includes('north') && lowerMessage.includes('hall'))) {
        return "🏢 **Directions to North Agora Hall**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and head towards the central Agora area\n2. From the main Agora, walk towards the northern section\n3. Look for the building marked 'North Agora Hall'\n4. It's located in the upper portion of the campus map\n\n⏱️ **Estimated walk time:** 5-7 minutes from main entrance\n📋 **Tip:** Less crowded alternative venue for events!";
    }
    
    if (lowerMessage.includes('sports complex') || lowerMessage.includes('basketball') || lowerMessage.includes('sports hall')) {
        return "🏀 **Directions to Sports Complex**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and walk towards the left (western) side\n2. Head past the main academic buildings\n3. Look for the large sports facility with courts\n4. The Sports Complex includes basketball courts and other sports facilities\n5. Follow signs for 'Sports Complex' or 'Sports Hall'\n\n⏱️ **Estimated walk time:** 6-8 minutes from main entrance\n📋 **Facilities:** Basketball courts, sports equipment, spectator seating!";
    }
    
    if (lowerMessage.includes('career center') || lowerMessage.includes('career centre')) {
        return "💼 **Directions to Career Center**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and head towards the central academic area\n2. Look for the administrative building complex\n3. The Career Center is typically located in the main services building\n4. Follow signs for 'Student Services' or 'Career Center'\n5. It's usually on the ground floor for easy access\n\n⏱️ **Estimated walk time:** 4-6 minutes from main entrance\n📋 **Services:** Career counseling, resume help, job interview prep!";
    }
    
    if (lowerMessage.includes('swimming complex') || lowerMessage.includes('swimming pool') || lowerMessage.includes('pool')) {
        return "🏊 **Directions to Swimming Complex**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and head towards the sports facilities area\n2. Walk past the main Sports Complex\n3. Look for the aquatic center - it's a separate building\n4. Follow signs for 'Swimming Pool' or 'Aquatic Center'\n5. The complex includes changing rooms and spectator areas\n\n⏱️ **Estimated walk time:** 7-10 minutes from main entrance\n📋 **Facilities:** Olympic-size pool, diving boards, changing rooms!";
    }
    
    if (lowerMessage.includes('e61h') || lowerMessage.includes('e61') || lowerMessage.includes('e-61')) {
        return "💻 **Directions to E61H (Computer Lab)**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and head towards the E-Building complex\n2. Look for the Eastern section of campus buildings\n3. Find the E61 building - it's part of the technology/computer science area\n4. E61H is the specific room within E61\n5. Follow signs for 'Computer Labs' or 'E-Building'\n\n⏱️ **Estimated walk time:** 5-7 minutes from main entrance\n📋 **Perfect for:** Coding bootcamps, tech workshops, computer classes!";
    }
    
    // General navigation help
    if (lowerMessage.includes('direction') || lowerMessage.includes('navigate') || lowerMessage.includes('map')) {
        return "🗺️ **Campus Navigation Help**\n\nI can provide step-by-step directions to these venues:\n\n🏫 **Academic Venues:**\n• LR-W5 (Lecture Rooms)\n• E61H (Computer Labs)\n• Career Center\n\n🏛️ **Event Halls:**\n• Main Agora (Outdoor)\n• South Agora Halls 1-4\n• North Agora Hall\n\n🏃 **Sports Facilities:**\n• Sports Complex\n• Swimming Complex\n\n💡 **Just ask:** 'How to get to [venue name]' or 'Directions to [location]'\n\n📍 **Campus Tip:** Most venues are within 5-10 minutes walking distance from the main entrance!";
    }
    
    // Fallback for location-related queries
    return "🗺️ **Campus Navigation**\n\nI can help you get directions to any campus venue! Try asking:\n\n• 'How do I get to LR-W5?'\n• 'Where is the Sports Complex?'\n• 'Directions to South Agora Hall'\n• 'How to reach the Swimming Complex?'\n\nJust mention the venue name and I'll provide step-by-step directions! 🚶‍♂️";
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

// Updated generateBotResponse to handle general questions more effectively
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

    // Navigation and directions
    if (message.includes('direction') || message.includes('navigate') || message.includes('how to get') || 
        message.includes('where is') || message.includes('location') || message.includes('map') ||
        message.includes('lr-w5') || message.includes('agora') || message.includes('sports complex') ||
        message.includes('career center') || message.includes('career centre') || message.includes('swimming') ||
        message.includes('e61h') || message.includes('hall')) {
        return getNavigationGuide(message);
    }

    // General questions
    if (message.includes('help') || message.includes('what can you do')) {
        return "I'm your campus assistant! Here's how I can help:\n\n🎯 Find events that match your interests\n📝 Guide you through registration\n⏰ Help set up reminders\n🗺️ Provide campus navigation and directions\n🎓 Share campus information\n📱 Answer questions about our platform\n\nJust ask me anything about campus events, directions, or student life!";
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

// Campus Navigation Guide based on the university map
function getNavigationGuide(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for specific venue requests
    if (lowerMessage.includes('lr-w5') || lowerMessage.includes('lr w5')) {
        return "🏫 **Directions to LR-W5 (Lecture Room)**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and walk straight towards the central area\n2. Head towards the W-Building complex (green area on the map)\n3. LR-W5 is located in the W5 building section\n4. Look for the W5 building signage - it's part of the main academic complex\n\n⏱️ **Estimated walk time:** 3-5 minutes from main entrance\n📋 **Tip:** LR-W5 is commonly used for tech and academic events!";
    }
    
    if (lowerMessage.includes('agora') && !lowerMessage.includes('south') && !lowerMessage.includes('north')) {
        return "🏛️ **Directions to Main Agora (Outside W1)**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and walk straight ahead\n2. The Agora is the large open courtyard area in the center\n3. Look for the outdoor space adjacent to the W1 building\n4. It's the main gathering area - you'll see the open plaza\n\n⏱️ **Estimated walk time:** 2-3 minutes from main entrance\n📋 **Perfect for:** Outdoor concerts, festivals, and social gatherings!";
    }
    
    if (lowerMessage.includes('south agora hall') || (lowerMessage.includes('south') && lowerMessage.includes('hall'))) {
        return "🏢 **Directions to South Agora Halls 1-4**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and head towards the central Agora area\n2. From the main Agora, walk towards the southern section\n3. Look for the building complex labeled 'South Agora Halls'\n4. Halls 1-4 are numbered and clearly marked\n5. Hall 1 is closest to the main Agora, Hall 4 is furthest south\n\n⏱️ **Estimated walk time:** 4-6 minutes from main entrance\n📋 **Great for:** Art exhibitions, food fairs, and indoor social events!";
    }
    
    if (lowerMessage.includes('north agora hall') || (lowerMessage.includes('north') && lowerMessage.includes('hall'))) {
        return "🏢 **Directions to North Agora Hall**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and head towards the central Agora area\n2. From the main Agora, walk towards the northern section\n3. Look for the building marked 'North Agora Hall'\n4. It's located in the upper portion of the campus map\n\n⏱️ **Estimated walk time:** 5-7 minutes from main entrance\n📋 **Tip:** Less crowded alternative venue for events!";
    }
    
    if (lowerMessage.includes('sports complex') || lowerMessage.includes('basketball') || lowerMessage.includes('sports hall')) {
        return "🏀 **Directions to Sports Complex**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and walk towards the left (western) side\n2. Head past the main academic buildings\n3. Look for the large sports facility with courts\n4. The Sports Complex includes basketball courts and other sports facilities\n5. Follow signs for 'Sports Complex' or 'Sports Hall'\n\n⏱️ **Estimated walk time:** 6-8 minutes from main entrance\n📋 **Facilities:** Basketball courts, sports equipment, spectator seating!";
    }
    
    if (lowerMessage.includes('career center') || lowerMessage.includes('career centre')) {
        return "💼 **Directions to Career Center**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and head towards the central academic area\n2. Look for the administrative building complex\n3. The Career Center is typically located in the main services building\n4. Follow signs for 'Student Services' or 'Career Center'\n5. It's usually on the ground floor for easy access\n\n⏱️ **Estimated walk time:** 4-6 minutes from main entrance\n📋 **Services:** Career counseling, resume help, job interview prep!";
    }
    
    if (lowerMessage.includes('swimming complex') || lowerMessage.includes('swimming pool') || lowerMessage.includes('pool')) {
        return "🏊 **Directions to Swimming Complex**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and head towards the sports facilities area\n2. Walk past the main Sports Complex\n3. Look for the aquatic center - it's a separate building\n4. Follow signs for 'Swimming Pool' or 'Aquatic Center'\n5. The complex includes changing rooms and spectator areas\n\n⏱️ **Estimated walk time:** 7-10 minutes from main entrance\n📋 **Facilities:** Olympic-size pool, diving boards, changing rooms!";
    }
    
    if (lowerMessage.includes('e61h') || lowerMessage.includes('e61') || lowerMessage.includes('e-61')) {
        return "💻 **Directions to E61H (Computer Lab)**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and head towards the E-Building complex\n2. Look for the Eastern section of campus buildings\n3. Find the E61 building - it's part of the technology/computer science area\n4. E61H is the specific room within E61\n5. Follow signs for 'Computer Labs' or 'E-Building'\n\n⏱️ **Estimated walk time:** 5-7 minutes from main entrance\n📋 **Perfect for:** Coding bootcamps, tech workshops, computer classes!";
    }
    
    // General navigation help
    if (lowerMessage.includes('direction') || lowerMessage.includes('navigate') || lowerMessage.includes('map')) {
        return "🗺️ **Campus Navigation Help**\n\nI can provide step-by-step directions to these venues:\n\n🏫 **Academic Venues:**\n• LR-W5 (Lecture Rooms)\n• E61H (Computer Labs)\n• Career Center\n\n🏛️ **Event Halls:**\n• Main Agora (Outdoor)\n• South Agora Halls 1-4\n• North Agora Hall\n\n🏃 **Sports Facilities:**\n• Sports Complex\n• Swimming Complex\n\n💡 **Just ask:** 'How to get to [venue name]' or 'Directions to [location]'\n\n📍 **Campus Tip:** Most venues are within 5-10 minutes walking distance from the main entrance!";
    }
    
    // Fallback for location-related queries
    return "🗺️ **Campus Navigation**\n\nI can help you get directions to any campus venue! Try asking:\n\n• 'How do I get to LR-W5?'\n• 'Where is the Sports Complex?'\n• 'Directions to South Agora Hall'\n• 'How to reach the Swimming Complex?'\n\nJust mention the venue name and I'll provide step-by-step directions! 🚶‍♂️";
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

// Updated generateBotResponse to handle general questions more effectively
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

    // Navigation and directions
    if (message.includes('direction') || message.includes('navigate') || message.includes('how to get') || 
        message.includes('where is') || message.includes('location') || message.includes('map') ||
        message.includes('lr-w5') || message.includes('agora') || message.includes('sports complex') ||
        message.includes('career center') || message.includes('career centre') || message.includes('swimming') ||
        message.includes('e61h') || message.includes('hall')) {
        return getNavigationGuide(message);
    }

    // General questions
    if (message.includes('help') || message.includes('what can you do')) {
        return "I'm your campus assistant! Here's how I can help:\n\n🎯 Find events that match your interests\n📝 Guide you through registration\n⏰ Help set up reminders\n🗺️ Provide campus navigation and directions\n🎓 Share campus information\n📱 Answer questions about our platform\n\nJust ask me anything about campus events, directions, or student life!";
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

// Campus Navigation Guide based on the university map
function getNavigationGuide(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for specific venue requests
    if (lowerMessage.includes('lr-w5') || lowerMessage.includes('lr w5')) {
        return "🏫 **Directions to LR-W5 (Lecture Room)**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and walk straight towards the central area\n2. Head towards the W-Building complex (green area on the map)\n3. LR-W5 is located in the W5 building section\n4. Look for the W5 building signage - it's part of the main academic complex\n\n⏱️ **Estimated walk time:** 3-5 minutes from main entrance\n📋 **Tip:** LR-W5 is commonly used for tech and academic events!";
    }
    
    if (lowerMessage.includes('agora') && !lowerMessage.includes('south') && !lowerMessage.includes('north')) {
        return "🏛️ **Directions to Main Agora (Outside W1)**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and walk straight ahead\n2. The Agora is the large open courtyard area in the center\n3. Look for the outdoor space adjacent to the W1 building\n4. It's the main gathering area - you'll see the open plaza\n\n⏱️ **Estimated walk time:** 2-3 minutes from main entrance\n📋 **Perfect for:** Outdoor concerts, festivals, and social gatherings!";
    }
    
    if (lowerMessage.includes('south agora hall') || (lowerMessage.includes('south') && lowerMessage.includes('hall'))) {
        return "🏢 **Directions to South Agora Halls 1-4**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and head towards the central Agora area\n2. From the main Agora, walk towards the southern section\n3. Look for the building complex labeled 'South Agora Halls'\n4. Halls 1-4 are numbered and clearly marked\n5. Hall 1 is closest to the main Agora, Hall 4 is furthest south\n\n⏱️ **Estimated walk time:** 4-6 minutes from main entrance\n📋 **Great for:** Art exhibitions, food fairs, and indoor social events!";
    }
    
    if (lowerMessage.includes('north agora hall') || (lowerMessage.includes('north') && lowerMessage.includes('hall'))) {
        return "🏢 **Directions to North Agora Hall**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and head towards the central Agora area\n2. From the main Agora, walk towards the northern section\n3. Look for the building marked 'North Agora Hall'\n4. It's located in the upper portion of the campus map\n\n⏱️ **Estimated walk time:** 5-7 minutes from main entrance\n📋 **Tip:** Less crowded alternative venue for events!";
    }
    
    if (lowerMessage.includes('sports complex') || lowerMessage.includes('basketball') || lowerMessage.includes('sports hall')) {
        return "🏀 **Directions to Sports Complex**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and walk towards the left (western) side\n2. Head past the main academic buildings\n3. Look for the large sports facility with courts\n4. The Sports Complex includes basketball courts and other sports facilities\n5. Follow signs for 'Sports Complex' or 'Sports Hall'\n\n⏱️ **Estimated walk time:** 6-8 minutes from main entrance\n📋 **Facilities:** Basketball courts, sports equipment, spectator seating!";
    }
    
    if (lowerMessage.includes('career center') || lowerMessage.includes('career centre')) {
        return "💼 **Directions to Career Center**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and head towards the central academic area\n2. Look for the administrative building complex\n3. The Career Center is typically located in the main services building\n4. Follow signs for 'Student Services' or 'Career Center'\n5. It's usually on the ground floor for easy access\n\n⏱️ **Estimated walk time:** 4-6 minutes from main entrance\n📋 **Services:** Career counseling, resume help, job interview prep!";
    }
    
    if (lowerMessage.includes('swimming complex') || lowerMessage.includes('swimming pool') || lowerMessage.includes('pool')) {
        return "🏊 **Directions to Swimming Complex**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and head towards the sports facilities area\n2. Walk past the main Sports Complex\n3. Look for the aquatic center - it's a separate building\n4. Follow signs for 'Swimming Pool' or 'Aquatic Center'\n5. The complex includes changing rooms and spectator areas\n\n⏱️ **Estimated walk time:** 7-10 minutes from main entrance\n📋 **Facilities:** Olympic-size pool, diving boards, changing rooms!";
    }
    
    if (lowerMessage.includes('e61h') || lowerMessage.includes('e61') || lowerMessage.includes('e-61')) {
        return "💻 **Directions to E61H (Computer Lab)**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and head towards the E-Building complex\n2. Look for the Eastern section of campus buildings\n3. Find the E61 building - it's part of the technology/computer science area\n4. E61H is the specific room within E61\n5. Follow signs for 'Computer Labs' or 'E-Building'\n\n⏱️ **Estimated walk time:** 5-7 minutes from main entrance\n📋 **Perfect for:** Coding bootcamps, tech workshops, computer classes!";
    }
    
    // General navigation help
    if (lowerMessage.includes('direction') || lowerMessage.includes('navigate') || lowerMessage.includes('map')) {
        return "🗺️ **Campus Navigation Help**\n\nI can provide step-by-step directions to these venues:\n\n🏫 **Academic Venues:**\n• LR-W5 (Lecture Rooms)\n• E61H (Computer Labs)\n• Career Center\n\n🏛️ **Event Halls:**\n• Main Agora (Outdoor)\n• South Agora Halls 1-4\n• North Agora Hall\n\n🏃 **Sports Facilities:**\n• Sports Complex\n• Swimming Complex\n\n💡 **Just ask:** 'How to get to [venue name]' or 'Directions to [location]'\n\n📍 **Campus Tip:** Most venues are within 5-10 minutes walking distance from the main entrance!";
    }
    
    // Fallback for location-related queries
    return "🗺️ **Campus Navigation**\n\nI can help you get directions to any campus venue! Try asking:\n\n• 'How do I get to LR-W5?'\n• 'Where is the Sports Complex?'\n• 'Directions to South Agora Hall'\n• 'How to reach the Swimming Complex?'\n\nJust mention the venue name and I'll provide step-by-step directions! 🚶‍♂️";
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

// Updated generateBotResponse to handle general questions more effectively
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

    // Navigation and directions
    if (message.includes('direction') || message.includes('navigate') || message.includes('how to get') || 
        message.includes('where is') || message.includes('location') || message.includes('map') ||
        message.includes('lr-w5') || message.includes('agora') || message.includes('sports complex') ||
        message.includes('career center') || message.includes('career centre') || message.includes('swimming') ||
        message.includes('e61h') || message.includes('hall')) {
        return getNavigationGuide(message);
    }

    // General questions
    if (message.includes('help') || message.includes('what can you do')) {
        return "I'm your campus assistant! Here's how I can help:\n\n🎯 Find events that match your interests\n📝 Guide you through registration\n⏰ Help set up reminders\n🗺️ Provide campus navigation and directions\n🎓 Share campus information\n📱 Answer questions about our platform\n\nJust ask me anything about campus events, directions, or student life!";
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

// Campus Navigation Guide based on the university map
function getNavigationGuide(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for specific venue requests
    if (lowerMessage.includes('lr-w5') || lowerMessage.includes('lr w5')) {
        return "🏫 **Directions to LR-W5 (Lecture Room)**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and walk straight towards the central area\n2. Head towards the W-Building complex (green area on the map)\n3. LR-W5 is located in the W5 building section\n4. Look for the W5 building signage - it's part of the main academic complex\n\n⏱️ **Estimated walk time:** 3-5 minutes from main entrance\n📋 **Tip:** LR-W5 is commonly used for tech and academic events!";
    }
    
    if (lowerMessage.includes('agora') && !lowerMessage.includes('south') && !lowerMessage.includes('north')) {
        return "🏛️ **Directions to Main Agora (Outside W1)**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and walk straight ahead\n2. The Agora is the large open courtyard area in the center\n3. Look for the outdoor space adjacent to the W1 building\n4. It's the main gathering area - you'll see the open plaza\n\n⏱️ **Estimated walk time:** 2-3 minutes from main entrance\n📋 **Perfect for:** Outdoor concerts, festivals, and social gatherings!";
    }
    
    if (lowerMessage.includes('south agora hall') || (lowerMessage.includes('south') && lowerMessage.includes('hall'))) {
        return "🏢 **Directions to South Agora Halls 1-4**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and head towards the central Agora area\n2. From the main Agora, walk towards the southern section\n3. Look for the building complex labeled 'South Agora Halls'\n4. Halls 1-4 are numbered and clearly marked\n5. Hall 1 is closest to the main Agora, Hall 4 is furthest south\n\n⏱️ **Estimated walk time:** 4-6 minutes from main entrance\n📋 **Great for:** Art exhibitions, food fairs, and indoor social events!";
    }
    
    if (lowerMessage.includes('north agora hall') || (lowerMessage.includes('north') && lowerMessage.includes('hall'))) {
        return "🏢 **Directions to North Agora Hall**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and head towards the central Agora area\n2. From the main Agora, walk towards the northern section\n3. Look for the building marked 'North Agora Hall'\n4. It's located in the upper portion of the campus map\n\n⏱️ **Estimated walk time:** 5-7 minutes from main entrance\n📋 **Tip:** Less crowded alternative venue for events!";
    }
    
    if (lowerMessage.includes('sports complex') || lowerMessage.includes('basketball') || lowerMessage.includes('sports hall')) {
        return "🏀 **Directions to Sports Complex**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and walk towards the left (western) side\n2. Head past the main academic buildings\n3. Look for the large sports facility with courts\n4. The Sports Complex includes basketball courts and other sports facilities\n5. Follow signs for 'Sports Complex' or 'Sports Hall'\n\n⏱️ **Estimated walk time:** 6-8 minutes from main entrance\n📋 **Facilities:** Basketball courts, sports equipment, spectator seating!";
    }
    
    if (lowerMessage.includes('career center') || lowerMessage.includes('career centre')) {
        return "💼 **Directions to Career Center**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and head towards the central academic area\n2. Look for the administrative building complex\n3. The Career Center is typically located in the main services building\n4. Follow signs for 'Student Services' or 'Career Center'\n5. It's usually on the ground floor for easy access\n\n⏱️ **Estimated walk time:** 4-6 minutes from main entrance\n📋 **Services:** Career counseling, resume help, job interview prep!";
    }
    
    if (lowerMessage.includes('swimming complex') || lowerMessage.includes('swimming pool') || lowerMessage.includes('pool')) {
        return "🏊 **Directions to Swimming Complex**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and head towards the sports facilities area\n2. Walk past the main Sports Complex\n3. Look for the aquatic center - it's a separate building\n4. Follow signs for 'Swimming Pool' or 'Aquatic Center'\n5. The complex includes changing rooms and spectator areas\n\n⏱️ **Estimated walk time:** 7-10 minutes from main entrance\n📋 **Facilities:** Olympic-size pool, diving boards, changing rooms!";
    }
    
    if (lowerMessage.includes('e61h') || lowerMessage.includes('e61') || lowerMessage.includes('e-61')) {
        return "💻 **Directions to E61H (Computer Lab)**\n\n📍 **Starting from Main Entrance:**\n1. Enter campus and head towards the E-Building complex\n2. Look for the Eastern section of campus buildings\n3. Find the E61 building - it's part of the technology/computer science area\n4. E61H is the specific room within E61\n5. Follow signs for 'Computer Labs' or 'E-Building'\n\n⏱️ **Estimated walk time:** 5-7 minutes from main entrance\n📋 **Perfect for:** Coding bootcamps, tech workshops, computer classes!";
    }
    
    // General navigation help
    if (lowerMessage.includes('direction') || lowerMessage.includes('navigate') || lowerMessage.includes('map')) {
        return "🗺️ **Campus Navigation Help**\n\nI can provide step-by-step directions to these venues:\n\n🏫 **Academic Venues:**\n• LR-W5 (Lecture Rooms)\n• E61H (Computer Labs)\n• Career Center\n\n🏛️ **Event Halls:**\n• Main Agora (Outdoor)\n• South Agora Halls 1-4\n• North Agora Hall\n\n🏃 **Sports Facilities:**\n• Sports Complex\n• Swimming Complex\n\n💡 **Just ask:** 'How to get to [venue name]' or 'Directions to [location]'\n\n📍 **Campus Tip:** Most venues are within 5-10 minutes walking distance from the main entrance!";
    }
    
    // Fallback for location-related queries
    return "🗺️ **Campus Navigation**\n\nI can help you get directions to any campus venue! Try asking:\n\n• 'How do I get to LR-W5?'\n• 'Where is the Sports Complex?'\n• 'Directions to South Agora Hall'\n• 'How to reach the Swimming Complex?'\n\nJust mention the venue name and I'll provide step-by-step directions! 🚶‍♂️";
}