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

// Share Event Function
function shareEvent(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return;

    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const formattedTime = formatTime(event.time);
    
    const shareText = `🎉 Check out this amazing campus event!\n\n` +
                     `📅 ${event.title}\n` +
                     `🗓️ ${formattedDate} at ${formattedTime}\n` +
                     `📍 ${event.venue}\n` +
                     `👥 ${event.attendees}/${event.maxAttendees} attendees\n\n` +
                     `${event.description}\n\n` +
                     `Join me at this event! 🎯`;

    // Check if Web Share API is supported
    if (navigator.share) {
        navigator.share({
            title: `Campus Event: ${event.title}`,
            text: shareText,
            url: window.location.href
        }).then(() => {
            showNotification('Event shared successfully! 📤');
        }).catch((error) => {
            console.log('Error sharing:', error);
            fallbackShare(shareText, event);
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        fallbackShare(shareText, event);
    }
}

// Fallback share function for browsers without Web Share API
function fallbackShare(shareText, event) {
    // Create a temporary textarea to copy text to clipboard
    const textArea = document.createElement('textarea');
    textArea.value = shareText;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Event details copied to clipboard! 📋 Share it with your friends!');
        
        // Show additional sharing options
        showShareOptions(event, shareText);
    } catch (err) {
        console.error('Could not copy text: ', err);
        showNotification('Unable to copy to clipboard. Please manually share the event details.');
    }
    
    document.body.removeChild(textArea);
}

// Show additional sharing options
function showShareOptions(event, shareText) {
    const shareModal = document.createElement('div');
    shareModal.className = 'modal-overlay';
    shareModal.id = 'shareModal';
    shareModal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3 class="modal-title">Share "${event.title}"</h3>
                <button class="modal-close" onclick="closeShareModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p style="margin-bottom: 1rem; color: var(--text-light);">
                    Event details have been copied to your clipboard! Choose how you'd like to share:
                </p>
                <div class="share-options">
                    <button class="btn btn-primary" onclick="shareViaWhatsApp('${encodeURIComponent(shareText)}')">
                        <i class="fab fa-whatsapp"></i>
                        WhatsApp
                    </button>
                    <button class="btn btn-primary" onclick="shareViaEmail('${encodeURIComponent(event.title)}', '${encodeURIComponent(shareText)}')">
                        <i class="fas fa-envelope"></i>
                        Email
                    </button>
                    <button class="btn btn-primary" onclick="shareViaTwitter('${encodeURIComponent(shareText)}')">
                        <i class="fab fa-twitter"></i>
                        Twitter
                    </button>
                    <button class="btn btn-secondary" onclick="copyShareLink()">
                        <i class="fas fa-link"></i>
                        Copy Link
                    </button>
                </div>
                <div class="share-preview">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Preview:</label>
                    <textarea readonly style="width: 100%; height: 120px; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 8px; font-family: inherit; font-size: 0.9rem; background: var(--bg-light);">${shareText}</textarea>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(shareModal);
    shareModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close share modal
function closeShareModal() {
    const shareModal = document.getElementById('shareModal');
    if (shareModal) {
        shareModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            document.body.removeChild(shareModal);
        }, 300);
    }
}

// Share via different platforms
function shareViaWhatsApp(text) {
    window.open(`https://wa.me/?text=${text}`, '_blank');
    closeShareModal();
}

function shareViaEmail(subject, body) {
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    closeShareModal();
}

function shareViaTwitter(text) {
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    closeShareModal();
}

function copyShareLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        showNotification('Event page link copied to clipboard! 🔗');
        closeShareModal();
    }).catch(() => {
        showNotification('Unable to copy link to clipboard.');
    });
}

// Set Reminder Function
function setReminder(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return;

    const eventDate = new Date(event.date + 'T' + event.time);
    const now = new Date();
    
    // Check if event is in the past
    if (eventDate < now) {
        showNotification('⚠️ Cannot set reminder for past events.');
        return;
    }

    // Go directly to Google Calendar
    addToCalendar(eventId);
}

// Show reminder options modal
function showReminderModal(event, eventDate) {
    const reminderModal = document.createElement('div');
    reminderModal.className = 'modal-overlay';
    reminderModal.id = 'reminderModal';
    
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedTime = formatTime(event.time);
    
    reminderModal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3 class="modal-title">Set Reminder for "${event.title}"</h3>
                <button class="modal-close" data-action="close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="event-reminder-info">
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
                </div>
                
                <div class="reminder-methods">
                    <h4 style="margin: 1.5rem 0 1rem 0;">Choose how you'd like to be reminded:</h4>
                    <div class="method-buttons">
                        <button class="btn btn-primary" data-action="add-calendar" data-event-id="${event.id}">
                            <i class="fas fa-calendar-plus"></i>
                            Add to Calendar
                        </button>
                        <button class="btn btn-secondary" data-action="email-reminder" data-event-id="${event.id}">
                            <i class="fas fa-envelope"></i>
                            Email Reminder
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(reminderModal);
    reminderModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add event listeners to buttons
    const buttons = reminderModal.querySelectorAll('button[data-action]');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            const eventId = parseInt(this.dataset.eventId);
            
            if (action === 'close') {
                closeReminderModal();
                return;
            }
            
            switch(action) {
                case 'add-calendar':
                    addToCalendar(eventId);
                    break;
                case 'email-reminder':
                    scheduleEmailReminder(eventId);
                    break;
            }
        });
    });
    
    // Add event listener for clicking outside the modal
    reminderModal.addEventListener('click', function(e) {
        if (e.target === reminderModal) {
            closeReminderModal();
        }
    });
}

// Close reminder modal
function closeReminderModal() {
    const reminderModal = document.getElementById('reminderModal');
    if (reminderModal) {
        reminderModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            document.body.removeChild(reminderModal);
        }, 300);
    }
}

// Add event to calendar
function addToCalendar(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return;

    const startDate = new Date(event.date + 'T' + event.time);
    const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000)); // Assume 2-hour duration
    
    const calendarUrl = generateCalendarUrl(event, startDate, endDate);
    window.open(calendarUrl, '_blank');
    
    showNotification(`📅 Opening Google Calendar to add "${event.title}"!`);
}

// Generate calendar URL (Google Calendar format)
function generateCalendarUrl(event, startDate, endDate) {
    const formatDate = (date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: event.title,
        dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
        details: event.description,
        location: event.venue,
        trp: false
    });
    
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Schedule email reminder (placeholder - would require backend)
function scheduleEmailReminder(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return;

    // Close the reminder modal first
    closeReminderModal();
    
    // Show email options modal
    showEmailReminderModal(event);
}

// Show email reminder options modal
function showEmailReminderModal(event) {
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedTime = formatTime(event.time);
    
    const emailBody = `Event Reminder: ${event.title}

Date: ${formattedDate}
Time: ${formattedTime}
Venue: ${event.venue}

Description: ${event.description}

Don't forget to attend this amazing event!`;
    
    const emailSubject = `Reminder: ${event.title}`;
    
    const emailModal = document.createElement('div');
    emailModal.className = 'modal-overlay';
    emailModal.id = 'emailModal';
    emailModal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3 class="modal-title">Email Reminder for "${event.title}"</h3>
                <button class="modal-close" data-action="close-email">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p style="margin-bottom: 1rem; color: var(--text-light);">
                    Choose how you'd like to create your email reminder:
                </p>
                
                <div class="email-options" style="margin-bottom: 1.5rem;">
                    <button class="btn btn-primary" data-action="open-email" data-subject="${encodeURIComponent(emailSubject)}" data-body="${encodeURIComponent(emailBody)}">
                        <i class="fas fa-envelope"></i>
                        Open in Default Email App
                    </button>
                    <button class="btn btn-secondary" data-action="copy-email" data-subject="${encodeURIComponent(emailSubject)}" data-body="${encodeURIComponent(emailBody)}">
                        <i class="fas fa-copy"></i>
                        Copy Email Content
                    </button>
                </div>
                
                <div class="email-preview">
                    <h4 style="margin-bottom: 0.5rem; color: var(--primary-color);">Email Preview:</h4>
                    <div style="background: var(--bg-light); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
                        <div style="margin-bottom: 0.5rem;">
                            <strong>Subject:</strong> ${emailSubject}
                        </div>
                        <div>
                            <strong>Body:</strong>
                            <pre style="white-space: pre-wrap; font-family: inherit; margin: 0.5rem 0 0 0; font-size: 0.9rem;">${emailBody}</pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(emailModal);
    emailModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add event listeners to buttons
    const emailButtons = emailModal.querySelectorAll('button[data-action]');
    emailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            
            if (action === 'close-email') {
                closeEmailModal();
                return;
            }
            
            const subject = this.dataset.subject;
            const body = this.dataset.body;
            
            switch(action) {
                case 'open-email':
                    openDefaultEmailClient(subject, body);
                    break;
                case 'copy-email':
                    copyEmailContent(subject, body);
                    break;
            }
        });
    });
    
    // Add event listener for clicking outside the modal
    emailModal.addEventListener('click', function(e) {
        if (e.target === emailModal) {
            closeEmailModal();
        }
    });
}

// Close email modal
function closeEmailModal() {
    const emailModal = document.getElementById('emailModal');
    if (emailModal) {
        emailModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            document.body.removeChild(emailModal);
        }, 300);
    }
}

// Open default email client
function openDefaultEmailClient(subject, body) {
    try {
        const decodedSubject = decodeURIComponent(subject);
        const decodedBody = decodeURIComponent(body);
        
        console.log('Attempting to open email client...');
        console.log('Subject:', decodedSubject);
        console.log('Body length:', decodedBody.length);
        
        // Show options modal for email clients
        showEmailClientOptions(decodedSubject, decodedBody);
        
    } catch (error) {
        console.error('Failed to prepare email:', error);
        copyEmailContent(subject, body);
    }
}

// Show email client options
function showEmailClientOptions(subject, body) {
    // Close the current email modal first
    closeEmailModal();
    
    const optionsModal = document.createElement('div');
    optionsModal.className = 'modal-overlay';
    optionsModal.id = 'emailOptionsModal';
    optionsModal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3 class="modal-title">Choose Your Email App</h3>
                <button class="modal-close" data-action="close-options">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p style="margin-bottom: 1rem; color: var(--text-light);">
                    Select how you'd like to create your email reminder:
                </p>
                
                <div class="email-client-options" style="display: grid; gap: 0.75rem; margin-bottom: 1.5rem;">
                    <button class="btn btn-primary" data-action="outlook-desktop" data-subject="${encodeURIComponent(subject)}" data-body="${encodeURIComponent(body)}">
                        <i class="fas fa-envelope"></i>
                        Outlook Desktop App
                    </button>
                    <button class="btn btn-primary" data-action="outlook-web" data-subject="${encodeURIComponent(subject)}" data-body="${encodeURIComponent(body)}">
                        <i class="fas fa-globe"></i>
                        Outlook Web (outlook.com)
                    </button>
                    <button class="btn btn-primary" data-action="gmail" data-subject="${encodeURIComponent(subject)}" data-body="${encodeURIComponent(body)}">
                        <i class="fab fa-google"></i>
                        Gmail
                    </button>
                    <button class="btn btn-secondary" data-action="generic-mailto" data-subject="${encodeURIComponent(subject)}" data-body="${encodeURIComponent(body)}">
                        <i class="fas fa-envelope-open"></i>
                        Default Email App
                    </button>
                    <button class="btn btn-outline" data-action="copy-direct" data-subject="${encodeURIComponent(subject)}" data-body="${encodeURIComponent(body)}">
                        <i class="fas fa-copy"></i>
                        Copy to Clipboard
                    </button>
                </div>
                
                <div class="email-preview" style="background: var(--bg-light); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); font-size: 0.9rem;">
                    <div style="margin-bottom: 0.5rem;"><strong>Subject:</strong> ${subject}</div>
                    <div><strong>Body:</strong></div>
                    <pre style="white-space: pre-wrap; font-family: inherit; margin: 0.5rem 0 0 0; color: var(--text-secondary);">${body}</pre>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(optionsModal);
    optionsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add event listeners to all buttons
    const optionButtons = optionsModal.querySelectorAll('button[data-action]');
    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            const subject = this.dataset.subject;
            const body = this.dataset.body;
            
            console.log('Email option clicked:', action);
            
            switch(action) {
                case 'close-options':
                    closeEmailOptionsModal();
                    break;
                case 'outlook-desktop':
                    openOutlookDesktop(subject, body);
                    break;
                case 'outlook-web':
                    openOutlookWeb(subject, body);
                    break;
                case 'gmail':
                    openGmail(subject, body);
                    break;
                case 'generic-mailto':
                    tryGenericMailto(subject, body);
                    break;
                case 'copy-direct':
                    copyEmailContentDirect(subject, body);
                    break;
                default:
                    console.log('Unknown action:', action);
            }
        });
    });
    
    // Add event listener for clicking outside the modal
    optionsModal.addEventListener('click', function(e) {
        if (e.target === optionsModal) {
            closeEmailOptionsModal();
        }
    });
}

// Close email options modal
function closeEmailOptionsModal() {
    const optionsModal = document.getElementById('emailOptionsModal');
    if (optionsModal) {
        optionsModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            document.body.removeChild(optionsModal);
        }, 300);
    }
}

// Open Outlook Desktop App
function openOutlookDesktop(subject, body) {
    try {
        const decodedSubject = decodeURIComponent(subject);
        const decodedBody = decodeURIComponent(body);
        
        // Try Outlook-specific protocol first
        const outlookUrl = `ms-outlook://compose?subject=${encodeURIComponent(decodedSubject)}&body=${encodeURIComponent(decodedBody)}`;
        
        console.log('Trying Outlook protocol:', outlookUrl);
        
        // Create a link and try to open it
        const link = document.createElement('a');
        link.href = outlookUrl;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('📧 Opening Outlook...');
        closeEmailOptionsModal();
        
        // Fallback after 3 seconds if Outlook doesn't open
        setTimeout(() => {
            const fallbackConfirm = confirm(
                'If Outlook didn\'t open, would you like to try the generic mailto link instead?'
            );
            if (fallbackConfirm) {
                tryGenericMailto(subject, body);
            }
        }, 3000);
        
    } catch (error) {
        console.error('Outlook desktop failed:', error);
        tryGenericMailto(subject, body);
    }
}

// Open Outlook Web
function openOutlookWeb(subject, body) {
    try {
        const decodedSubject = decodeURIComponent(subject);
        const decodedBody = decodeURIComponent(body);
        
        const outlookWebUrl = `https://outlook.office.com/mail/deeplink/compose?subject=${encodeURIComponent(decodedSubject)}&body=${encodeURIComponent(decodedBody)}`;
        
        console.log('Opening Outlook Web:', outlookWebUrl);
        
        window.open(outlookWebUrl, '_blank');
        showNotification('📧 Opening Outlook Web...');
        closeEmailOptionsModal();
        
    } catch (error) {
        console.error('Outlook web failed:', error);
        copyEmailContentDirect(subject, body);
    }
}

// Open Gmail
function openGmail(subject, body) {
    try {
        const decodedSubject = decodeURIComponent(subject);
        const decodedBody = decodeURIComponent(body);
        
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(decodedSubject)}&body=${encodeURIComponent(decodedBody)}`;
        
        console.log('Opening Gmail:', gmailUrl);
        
        window.open(gmailUrl, '_blank');
        showNotification('📧 Opening Gmail...');
        closeEmailOptionsModal();
        
    } catch (error) {
        console.error('Gmail failed:', error);
        copyEmailContentDirect(subject, body);
    }
}

// Try generic mailto
function tryGenericMailto(subject, body) {
    try {
        const decodedSubject = decodeURIComponent(subject);
        const decodedBody = decodeURIComponent(body);
        
        // Simple mailto with just subject (more reliable)
        const mailtoUrl = `mailto:?subject=${encodeURIComponent(decodedSubject)}`;
        
        console.log('Trying generic mailto:', mailtoUrl);
        
        window.location.href = mailtoUrl;
        showNotification('📧 Opening default email app...');
        closeEmailOptionsModal();
        
        // Offer to copy body content
        setTimeout(() => {
            const copyBodyConfirm = confirm(
                `Your email app should have opened with the subject line.\n\n` +
                `Would you like to copy the email body to paste manually?\n\n` +
                `Body: ${decodedBody.substring(0, 100)}...`
            );
            if (copyBodyConfirm) {
                navigator.clipboard.writeText(decodedBody).then(() => {
                    showNotification('📋 Email body copied to clipboard!');
                }).catch(() => {
                    alert(`Email body:\n\n${decodedBody}`);
                });
            }
        }, 2000);
        
    } catch (error) {
        console.error('Generic mailto failed:', error);
        copyEmailContentDirect(subject, body);
    }
}

// Copy email content directly
function copyEmailContentDirect(subject, body) {
    try {
        const decodedSubject = decodeURIComponent(subject);
        const decodedBody = decodeURIComponent(body);
        const emailContent = `Subject: ${decodedSubject}\n\n${decodedBody}`;
        
        navigator.clipboard.writeText(emailContent).then(() => {
            showNotification('📋 Email content copied to clipboard! You can paste it into any email app.');
            closeEmailOptionsModal();
        }).catch(() => {
            alert(`Email reminder content:\n\n${emailContent}`);
            closeEmailOptionsModal();
        });
    } catch (error) {
        console.error('Failed to copy email content:', error);
        const emailContent = `Subject: ${decodeURIComponent(subject)}\n\n${decodeURIComponent(body)}`;
        alert(`Email reminder content:\n\n${emailContent}`);
        closeEmailOptionsModal();
    }
}

// Show notification function
function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationText = notification.querySelector('.notification-text');
    
    if (notification && notificationText) {
        notificationText.textContent = message;
        notification.classList.add('show');
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    } else {
        // Fallback: use browser alert if notification element doesn't exist
        alert(message);
    }
}
