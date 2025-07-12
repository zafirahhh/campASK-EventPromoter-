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
    
    // Convert markdown-style bold (**text**) to HTML bold tags
    const formattedMessage = message.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <p>${formattedMessage}</p>
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

// Generate bot responses based on user message
function generateBotResponse(message) {
    const lowerMessage = message.toLowerCase();

    // Campus navigation help
    if (lowerMessage.includes('campus map') || lowerMessage.includes('navigation') || lowerMessage.includes('directions')) {
        return "🗺️ **Campus Navigation Available!**\n\nI can provide step-by-step directions to these locations:\n\n🏫 **Academic Buildings:**\n• LR-W5 (Lecture Room West 5)\n• E61H (Engineering Building)\n\n🎯 **Activity Centers:**\n• Agora (Main Hub)\n• Sports Complex\n• Swimming Complex\n\n🎪 **Event Venues:**\n• South Agora Hall 1-4\n• North Agora Hall\n\n💼 **Services:**\n• Career Centre\n\nJust tell me where you want to go! For example, say 'How do I get to LR-W5?' or 'Directions to Sports Complex'";
    }

    // Specific navigation requests
    if (lowerMessage.includes('lr-w5') || lowerMessage.includes('lecture room')) {
        return getNavigationGuide('LR-W5');
    }
    if (lowerMessage.includes('agora') && !lowerMessage.includes('hall')) {
        return getNavigationGuide('Agora');
    }
    if (lowerMessage.includes('sports complex')) {
        return getNavigationGuide('Sports Complex');
    }
    if (lowerMessage.includes('career centre') || lowerMessage.includes('career center')) {
        return getNavigationGuide('Career Centre');
    }
    if (lowerMessage.includes('south agora hall')) {
        return getNavigationGuide('South Agora Hall 1-4');
    }
    if (lowerMessage.includes('north agora hall')) {
        return getNavigationGuide('North Agora Hall');
    }
    if (lowerMessage.includes('swimming complex')) {
        return getNavigationGuide('Swimming Complex');
    }
    if (lowerMessage.includes('e61h') || lowerMessage.includes('engineering')) {
        return getNavigationGuide('E61H');
    }

    // Interest-based event recommendations
    if (lowerMessage.includes('interest') || lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('what events') || lowerMessage.includes('find events')) {
        return "🎯 <b>Finding Events That Match Your Interests</b>\n\nI'd love to help you discover events you'll enjoy! Here's how to find events based on your interests:\n\n<b>📚 Academic & Learning:</b>\n• Tech Innovation Summit (July 15) - Technology trends\n• Career Development Workshop (July 18) - Professional skills\n• Coding Bootcamp (July 31) - Programming skills\n\n<b>🏃 Sports & Fitness:</b>\n• Basketball Championship (July 25) - Team sports\n• Swimming Competition (July 28) - Individual competition\n\n<b>🎨 Arts & Social:</b>\n• Summer Music Festival (July 20) - Live music\n• International Food Fair (July 22) - Cultural experience\n• Art Exhibition (July 30) - Visual arts\n\n<b>🔍 Tell me what you're interested in!</b>\nSay things like:\n• 'I like technology and coding'\n• 'I enjoy sports and fitness'\n• 'I love music and arts'\n• 'I want to improve my career skills'\n\nI'll give you personalized recommendations! 🌟";
    }

    // Technology/coding interests
    if (lowerMessage.includes('technology') || lowerMessage.includes('tech') || lowerMessage.includes('coding') || lowerMessage.includes('programming') || lowerMessage.includes('computer')) {
        return "💻 <b>Perfect! Here are tech events for you:</b>\n\n<b>🚀 Tech Innovation Summit</b>\n📅 July 15, 2:00 PM at LR-W5\n🎯 Industry leaders discussing cutting-edge technology trends\n👥 195/200 spots taken - Register soon!\n\n<b>💻 Coding Bootcamp</b>\n📅 July 31, 9:00 AM at E61H\n🎯 Learn coding basics and advanced techniques\n👥 28/30 spots available - Almost full!\n\n<b>💡 Why you'll love these:</b>\n• Network with tech professionals\n• Learn latest industry trends\n• Hands-on coding experience\n• Free workshops and materials\n\n<b>🎯 Pro tip:</b> The Coding Bootcamp is beginner-friendly but also has advanced content - perfect for any skill level!\n\nReady to join the tech community? Click 'Join Now' on these events! 🔥";
    }

    // Sports/fitness interests
    if (lowerMessage.includes('sports') || lowerMessage.includes('fitness') || lowerMessage.includes('exercise') || lowerMessage.includes('basketball') || lowerMessage.includes('swimming') || lowerMessage.includes('athletic')) {
        return "🏃 <b>Great choice! Here are sports events for you:</b>\n\n<b>🏀 Basketball Championship</b>\n📅 July 25, 7:30 PM at Sports Complex\n🎯 Cheer for our university team in the finals!\n👥 405/600 spots - Free snacks and drinks included!\n\n<b>🏊 Swimming Competition</b>\n📅 July 28, 4:00 PM at Swimming Complex\n🎯 Open to all skill levels - medals for winners!\n👥 80/120 spots available\n\n<b>🎉 Why you'll love these:</b>\n• High-energy atmosphere\n• Support your university teams\n• Meet fellow sports enthusiasts\n• Free refreshments at basketball\n• Prizes and medals at swimming\n\n<b>🏆 Bonus:</b> Even if you're not competing in swimming, it's exciting to watch and cheer!\n\nGet your game face on and register now! 💪";
    }

    // Arts/music/creative interests
    if (lowerMessage.includes('music') || lowerMessage.includes('art') || lowerMessage.includes('creative') || lowerMessage.includes('culture') || lowerMessage.includes('artist') || lowerMessage.includes('festival')) {
        return "🎨 <b>Wonderful! Here are creative events for you:</b>\n\n<b>🎵 Summer Music Festival</b>\n📅 July 20, 6:00 PM at Agora (Outside W1)\n🎯 Outdoor concert with local bands and student performers\n👥 350/500 spots - Bring your friends!\n\n<b>🎨 Art Exhibition</b>\n📅 July 30, 10:00 AM at South Agora Hall 3-4\n🎯 Stunning artworks from students and local artists\n👥 FULLY BOOKED - But worth checking for cancellations!\n\n<b>🌍 International Food Fair</b>\n📅 July 22, 12:00 PM at South Agora Hall 1\n🎯 Cultural experience with cuisines from around the world\n👥 200/300 spots available\n\n<b>✨ Why you'll love these:</b>\n• Discover local talent\n• Immerse in different cultures\n• Great photo opportunities\n• Meet creative community\n• Outdoor festival vibes\n\n<b>🎭 Perfect combination:</b> Music + Food + Art = Amazing cultural experience!\n\nLet your creative side shine! 🌟";
    }

    // Career/professional interests
    if (lowerMessage.includes('career') || lowerMessage.includes('job') || lowerMessage.includes('professional') || lowerMessage.includes('resume') || lowerMessage.includes('interview') || lowerMessage.includes('networking') || lowerMessage.includes('improve my career skills')) {
        return "💼 <b>Excellent! Here are career-focused events for you:</b>\n\n<b>💼 Career Development Workshop</b>\n📅 July 18, 10:00 AM at Career Center\n🎯 Essential skills: interviews, resumes, networking\n👥 99/100 spots - ALMOST FULL! Register immediately!\n\n<b>🚀 Tech Innovation Summit</b>\n📅 July 15, 2:00 PM at LR-W5\n🎯 Network with industry leaders and explore opportunities\n👥 195/200 spots - Great for tech careers\n\n<b>🎯 What you'll gain:</b>\n• Professional resume writing tips\n• Interview techniques that work\n• Networking strategies\n• Industry insights from professionals\n• Direct contact with potential employers\n• Confidence in job applications\n\n<b>💡 Career Boost Strategy:</b>\n1. Attend Career Workshop first (July 18)\n2. Apply new skills at Tech Summit (July 15)\n3. Network with industry professionals\n4. Follow up with new connections\n\n<b>⚠️ URGENT:</b> Career Workshop is 99/100 full - register NOW!\n\nYour future career starts here! 🚀";
    }

    // Social/networking interests
    if (lowerMessage.includes('social') || lowerMessage.includes('friends') || lowerMessage.includes('meet people') || lowerMessage.includes('networking') || lowerMessage.includes('community')) {
        return "🤝 <b>Perfect! Here are great social events for you:</b>\n\n<b>🌍 International Food Fair</b>\n📅 July 22, 12:00 PM at South Agora Hall 1\n🎯 Meet international students, taste amazing food\n👥 200/300 spots - Social and delicious!\n\n<b>🎵 Summer Music Festival</b>\n📅 July 20, 6:00 PM at Agora (Outside W1)\n🎯 Outdoor concert - bring friends or make new ones!\n👥 350/500 spots - Perfect group activity\n\n<b>🏀 Basketball Championship</b>\n📅 July 25, 7:30 PM at Sports Complex\n🎯 Cheer together - instant bonding experience!\n👥 405/600 spots - High-energy social event\n\n<b>🎉 Why these are perfect for socializing:</b>\n• Relaxed, fun atmospheres\n• Natural conversation starters\n• Group activities and shared experiences\n• Mix of students from different programs\n• Food and entertainment included\n\n<b>💡 Social Success Tips:</b>\n• Arrive early to mingle\n• Join group activities\n• Ask others about their favorite parts\n• Exchange contact info with new friends\n\nReady to expand your social circle? 🌟";
    }

    // Withdrawal/cancellation queries
    if (lowerMessage.includes('withdraw') || lowerMessage.includes('cancel') || lowerMessage.includes('unregister') || lowerMessage.includes('remove application')) {
        return "❌ **Event Withdrawal & Cancellation**\n\nYes, you can withdraw from events you've registered for!\n\n**📱 How to withdraw:**\n\n**Step 1:** Click 'View My Applications' button (top right)\n**Step 2:** Find the event you want to withdraw from\n**Step 3:** Click the red 'Delete' button on that application\n**Step 4:** Confirm your withdrawal\n\n✅ **What happens when you withdraw:**\n• Your spot becomes available for other students\n• You'll receive a confirmation notification\n• The event attendee count will be updated\n• You can re-register later if spots are still available\n\n⏰ **Withdrawal Policy:**\n• No penalty for withdrawing\n• Withdraw anytime before the event\n• Immediate effect - your spot opens up right away\n\n💡 **Tip:** Consider withdrawing early if you can't attend, so others can join!";
    }

    // Payment/cost queries
    if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('pay') || lowerMessage.includes('fee') || lowerMessage.includes('money')) {
        return "💰 **Event Costs & Payment**\n\n**Great news! All campus events are completely FREE! 🎉**\n\n✅ **What's included at no cost:**\n• Event participation\n• Registration processing\n• Refreshments (when provided)\n• Materials and resources\n• Certificates (for workshops)\n\n🎓 **Why are events free?**\n• Funded by student activity fees\n• University commitment to student engagement\n• Community building initiative\n• Equal access for all students\n\n📝 **No hidden costs:**\n• No registration fees\n• No processing charges\n• No cancellation penalties\n• No material costs\n\nJust register and enjoy! 🌟";
    }

    // Waitlist queries
    if (lowerMessage.includes('waitlist') || lowerMessage.includes('wait list') || lowerMessage.includes('full') || lowerMessage.includes('sold out')) {
        return "📋 **Event Waitlist & Full Events**\n\n**When events are full:**\n\n🔄 **Current System:**\n• Events show 'Fully Booked' when at capacity\n• Registration buttons become disabled\n• Check back regularly for cancellations\n\n💡 **Pro Tips for Full Events:**\n\n**1. Check Back Frequently**\n   • Students sometimes withdraw\n   • Spots open up regularly\n   • Refresh the page to see updates\n\n**2. Contact Event Organizers**\n   • Some events may add extra capacity\n   • Special accommodations possible\n\n**3. Similar Events**\n   • Look for related events\n   • Many topics covered multiple times\n\n🎯 **Best Strategy:**\nRegister early when events are announced - popular events fill up within hours!\n\n📧 **Future Feature:** We're working on an automatic waitlist system!";
    }

    // Location/venue queries
    if (lowerMessage.includes('where') || lowerMessage.includes('location') || lowerMessage.includes('venue') || lowerMessage.includes('address')) {
        return "📍 **Event Locations & Venues**\n\n**All events are held on campus at these venues:**\n\n🏫 **Academic Buildings:**\n• **LR-W5** - Lecture Room West 5 (Main Academic Block)\n• **E61H** - Engineering Building (Tech Hub)\n• **Career Centre** - Student Services Building\n\n🎯 **Activity Centers:**\n• **Agora (Outside W1)** - Main campus courtyard\n• **Sports Complex** - Athletic facilities\n• **Swimming Complex** - Aquatic center\n\n🎪 **Event Halls:**\n• **South Agora Hall 1-4** - Multi-purpose event spaces\n• **North Agora Hall** - Large assembly venue\n\n🗺️ **Need directions?**\nClick the 'Campus Map' button or ask me 'How do I get to [venue name]' for step-by-step walking directions!\n\n📱 **Each event card shows:**\n• Exact venue name\n• Date and time\n• Building location";
    }

    // Requirements/eligibility queries
    if (lowerMessage.includes('requirement') || lowerMessage.includes('eligible') || lowerMessage.includes('who can') || lowerMessage.includes('prerequisite')) {
        return "✅ **Event Requirements & Eligibility**\n\n**Good news - Most events are open to everyone! 🎓**\n\n**👥 Who can attend:**\n• All enrolled students\n• Faculty and staff\n• Some events open to guests\n\n**📋 General Requirements:**\n• Valid student ID (for verification)\n• Email address (for confirmation)\n• On-time arrival recommended\n\n**📚 Special Requirements (if any):**\n• Academic workshops: No prerequisites\n• Sports events: No skill level required\n• Career workshops: All majors welcome\n• Social events: Just bring enthusiasm!\n\n**🎯 Workshop-Specific:**\n• Coding Bootcamp: Beginner-friendly\n• Career Development: All years welcome\n• Swimming Competition: All skill levels\n\n**❓ Event-specific requirements:**\nCheck individual event descriptions for any special notes or recommendations.\n\n💡 **When in doubt, just register!** Most events are designed to be inclusive and welcoming to everyone.";
    }

    // Contact/support queries
    if (lowerMessage.includes('contact') || lowerMessage.includes('support') || lowerMessage.includes('help desk') || lowerMessage.includes('organizer')) {
        return "📞 **Contact & Support**\n\n**Need additional help? Here are your options:**\n\n🤖 **First - Try me!**\n• I can answer most questions about events\n• Available 24/7 through this chat\n• Use the quick action buttons for common topics\n\n📧 **Event Organizers:**\n• Contact info provided in event confirmations\n• Specific questions about event content\n• Special accommodation requests\n\n🏫 **Student Services:**\n• **Location:** Career Centre building\n• **Hours:** Mon-Fri 9:00 AM - 5:00 PM\n• **For:** Registration issues, technical problems\n\n💻 **Technical Support:**\n• Website issues or bugs\n• Registration form problems\n• Account-related questions\n\n🆘 **Emergency Contact:**\n• Day of event: Contact venue directly\n• After hours: Campus security\n\n💡 **Quick Help:**\nMost issues can be resolved by:\n• Refreshing the page\n• Checking your email for confirmations\n• Trying a different browser";
    }

    // What to bring/preparation queries
    if (lowerMessage.includes('bring') || lowerMessage.includes('prepare') || lowerMessage.includes('what do i need') || lowerMessage.includes('materials')) {
        return "🎒 **What to Bring & Event Preparation**\n\n**📝 General Items for All Events:**\n• Student ID card (for check-in)\n• Water bottle (stay hydrated!)\n• Notebook and pen (for workshops)\n• Comfortable clothing\n\n**🎯 Event-Specific Preparations:**\n\n**🏀 Sports Events:**\n• Athletic wear and sneakers\n• Towel (for swimming events)\n• Team spirit and enthusiasm!\n\n**💼 Career Workshops:**\n• Resume copies (if you have one)\n• Questions about your field\n• Professional attire (recommended)\n\n**💻 Tech Workshops:**\n• Laptop (if you have one)\n• Charger\n• Note-taking materials\n\n**🎵 Social Events:**\n• Friends (more fun together!)\n• Positive attitude\n• Camera for memories\n\n**🍕 Food Events:**\n• Appetite and open mind\n• Dietary restrictions noted in registration\n\n✅ **Don't worry if you forget something!**\nMost events provide necessary materials and equipment.\n\n💡 **Check your confirmation email** for specific event requirements!";
    }

    // Help and general queries
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
        return "👋 **Hi there! I'm your Campus Event Assistant**\n\nI can help you with:\n\n🎯 **Quick Actions:**\n• Get upcoming event info\n• Learn how to register for events\n• Set up event reminders\n• Find your way around campus\n\n🗺️ **Campus Navigation:**\n• Directions to any campus location\n• Step-by-step walking guides\n• Building and venue information\n\n📱 **Event Management:**\n• Registration assistance\n• Reminder setup\n• Event details and schedules\n\nTry clicking one of the quick action buttons below, or just ask me anything! 😊";
    }

    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return "Hello! 👋 Welcome to the Campus Event Promoter! \n\nI'm here to help you discover amazing events, register for activities, and navigate around campus. What would you like to know about? \n\nTry one of the quick actions below or just ask me anything! 😊";
    }

    // Default response for unrecognized queries
    return "I'm here to help with campus events and navigation! 🤖\n\nTry asking me about:\n• Upcoming events\n• How to register\n• Event reminders\n• Campus directions\n\nOr use the quick action buttons below for instant help! ⚡";
}
