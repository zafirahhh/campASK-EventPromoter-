# 🎓 Event Promoter

A modern and responsive webpage designed to help students stay updated on upcoming campus events. Built with vanilla HTML, CSS, and JavaScript following mobile-first design principles.

## ✨ Features

- **Event Discovery**: Browse upcoming campus events with filtering by category (Academic, Social, Sports)
- **Event Registration**: Simple form-based application system for joining events
- **Smart Reminders**: Set calendar reminders or local notifications for events
- **Social Sharing**: Share events with friends via Web Share API or copy to clipboard
- **Responsive Design**: Mobile-first layout that works on all devices
- **Accessibility**: Full keyboard navigation and screen reader support
- **Modern UI**: Clean, youthful design with smooth animations

## 🎨 Design System

### Color Palette
- **Primary**: #003366 (Deep Blue)
- **Secondary**: #FFB800 (Warm Yellow) 
- **Accent**: #00C2A8 (Teal Green)
- **Background**: #F7F5F2

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js and npm (optional, for live-server)

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd event-promoter
   ```

2. **Install dependencies (optional)**
   ```bash
   npm install
   ```

3. **Run with Live Server (recommended)**
   ```bash
   npm start
   ```
   
   Or manually with Live Server extension in VS Code:
   - Right-click on `index.html`
   - Select "Open with Live Server"

4. **Alternative: Open directly in browser**
   - Simply open `index.html` in your web browser

## 📁 Project Structure

```
event-promoter/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # Complete styling with responsive design
├── js/
│   └── app.js              # Interactive functionality and event management
├── package.json            # Project configuration and scripts
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🔧 Features Overview

### Event Management
- **Dynamic Event Rendering**: Events loaded from JavaScript object
- **Category Filtering**: Filter by Academic, Social, or Sports events
- **Real-time Updates**: Attendee counts update dynamically

### User Interactions
- **Join Events**: Modal form for event registration
- **Set Reminders**: Integration with device calendar and notifications
- **Share Events**: Web Share API with clipboard fallback
- **Responsive Forms**: Accessible form design with validation

### Technical Features
- **Mobile-First Design**: Optimized for mobile devices first
- **CSS Grid & Flexbox**: Modern layout techniques
- **Vanilla JavaScript**: No framework dependencies
- **Web APIs**: Calendar, Notifications, Share, Clipboard
- **Accessibility**: ARIA labels, keyboard navigation, focus management

## 🎯 Event Data Structure

Each event contains:
- **Basic Info**: Title, description, category
- **Schedule**: Date, time, venue
- **Capacity**: Current attendees vs. maximum capacity
- **Visual**: AI-generated poster emoji
- **Functionality**: Registration, reminders, sharing

## 🌐 Browser Compatibility

- **Chrome/Edge**: Full support for all features
- **Firefox**: Full support for all features  
- **Safari**: Full support (iOS 12+, macOS 10.14+)
- **Mobile Browsers**: Optimized for mobile experience

## 📱 Progressive Web App Features

The webpage includes PWA-ready features:
- Service Worker registration placeholder
- Mobile-optimized navigation
- Offline-capable architecture foundation
- App-like user experience

## 🔄 Git Setup

Initialize git repository:
```bash
npm run init
```

Or manually:
```bash
git init
git add .
git commit -m "Initial commit: Event Promoter webpage"
```

## 🎨 Customization

### Adding New Events
Edit the `eventsData` array in `js/app.js`:

```javascript
{
    id: 7,
    title: "Your Event Title",
    description: "Event description here...",
    category: "academic", // academic, social, or sports
    date: "2025-07-30",
    time: "14:00",
    venue: "Event Location",
    poster: "🎨", // Emoji for poster
    attendees: 0,
    maxAttendees: 100
}
```

### Styling Changes
Modify CSS custom properties in `css/styles.css`:

```css
:root {
    --primary-color: #003366;
    --secondary-color: #FFB800;
    --accent-color: #00C2A8;
    --background-color: #F7F5F2;
}
```

## 🛠️ Development

### Local Development
```bash
npm run dev  # Runs live-server with file watching
```

### File Structure
- **HTML**: Semantic markup with accessibility features
- **CSS**: Mobile-first responsive design with CSS Grid/Flexbox
- **JavaScript**: ES6+ with modular function organization

## 📄 License

MIT License - feel free to use this project for educational purposes.

## 🤝 Contributing

This is an educational project. Feel free to fork and modify for your own campus events!

---

*Made for students, by students* 🎓
