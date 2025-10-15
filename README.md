# 🎮 Game Smiths Club Website

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4%2B-green.svg)](https://www.mongodb.com/)

A pixel-themed, retro-gaming inspired website for a college game development club. Features dynamic animations, parallax scrolling, interactive mini-games, and a membership system with MongoDB integration.

## ✨ Features

### 🎨 Visual Design
- **Pixel Art Aesthetic**: Retro gaming theme with neon cyan/magenta color palette
- **Parallax Scrolling**: Multi-layer background with depth effect
- **Custom Cursor**: Animated arrow cursor with ghost followers
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Dark Theme**: Modern dark mode with neon accents

### 🎮 Interactive Elements
- **Mini Games**: 
  - Snake Game (keyboard/mobile controls)
  - Pong Game (keyboard + touch controls)
- **Animated Logo**: Game Smiths Club logo with parallax effect
- **Pixel Rain**: Dynamic background particle effects
- **Scroll Animations**: GSAP-powered reveal animations
- **Easter Egg**: Press spacebar to make the logo jump!

### 📊 Dynamic Features
- **Live Countdown**: Timer to club launch date (October 17)
- **Member Counter**: Real-time member count from MongoDB
- **Join Guild Form**: Member registration with validation
- **Background Music**: Auto-play chiptune soundtrack with toggle

### 🔧 Technical Features
- **Server-Side Rendering**: EJS templates with Express.js
- **MongoDB Integration**: Member data storage and retrieval
- **RESTful API**: `/api/members/count` and `/api/join` endpoints
- **Form Validation**: Client and server-side validation
- **Mobile Optimizations**: Touch controls, performance optimizations
- **Custom Dropdowns**: Styled select elements with custom CSS

## 🚀 Quick Start

### Prerequisites
- Node.js (v14.0.0 or higher)
- MongoDB (v4.4 or higher)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AkshayRaj367/Game-Smiths-Club.git
   cd Game-Smiths-Club
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/gamesmithsclub
   PORT=3000
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

### Static Version (No Backend)
To use without MongoDB, simply open `index.html` in your browser. Member features will be disabled.

## 📁 Project Structure

```
Game-Smiths-Club/
├── index.html              # Static homepage
├── script.js               # Main client-side JavaScript
├── styles.css              # Main stylesheet
├── server.js               # Express.js server with MongoDB
├── package.json            # Node.js dependencies
├── .env.example            # Environment variables template
│
├── public/                 # Public assets (for SSR)
│   ├── css/
│   │   └── styles.css      # Production CSS
│   └── js/
│       └── script.js       # Production JavaScript
│
└── views/                  # EJS templates (for SSR)
    ├── index.ejs           # Homepage template
    └── partials/
        ├── head.ejs        # HTML head section
        ├── header.ejs      # Site header/navigation
        └── footer.ejs      # Site footer
```

## 🎮 Usage Guide

### For Visitors
- **Browse**: Scroll through sections to learn about the club
- **Play Games**: Try Snake and Pong in the mini-games section
- **Join**: Fill out the "Join the Guild" form to become a member
- **Toggle Music**: Click the ♫ button in the header to control music
- **Easter Eggs**: Press spacebar to make the logo jump!

### For Developers
- **Add Members**: POST to `/api/join` with member data
- **Get Count**: GET `/api/members/count` for total members
- **Customize**: Edit CSS variables in `styles.css` for theming
- **Add Content**: Modify EJS templates in `views/` folder

## 🛠️ Technologies Used

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Grid, Flexbox, animations
- **JavaScript (ES6+)** - Client-side interactivity
- **GSAP** - Animation library with ScrollTrigger

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **EJS** - Templating engine
- **dotenv** - Environment configuration
- **CORS** - Cross-origin resource sharing

### External Services
- **Cloudinary** - Image and audio hosting
- **Google Fonts** - Press Start 2P, Inter fonts

## 📱 Mobile Optimizations

- Touch controls for Pong game paddle
- Disabled cursor effects on touch devices
- Reduced animations for performance
- Responsive typography and spacing
- Mobile-friendly form validation
- Optimized image sizes

## 🎨 Customization

### Change Colors
Edit CSS variables in `styles.css`:
```css
:root {
  --c-cyan: #00ffff;      /* Primary accent */
  --c-mag: #ff00ff;       /* Secondary accent */
  --c-green: #00ff99;     /* Success color */
  --bg: #0a0a0f;          /* Background */
  --fg: #e6e6e6;          /* Text color */
}
```

### Update Club Information
- **Club Name**: Edit in `views/partials/header.ejs`
- **Countdown Date**: Modify `nextOct17()` function in `script.js`
- **Team Members**: Update team cards in `views/index.ejs`
- **Projects**: Edit project cards in `views/index.ejs`

### Add Background Music
Upload your audio file to Cloudinary and update:
```html
<audio id="bgm" loop preload="auto" autoplay>
  <source src="your-audio-url.mp3" type="audio/mpeg" />
</audio>
```

## 🔒 Security

- Input validation on client and server side
- MongoDB injection prevention via Mongoose
- Environment variables for sensitive data
- CORS configuration for API security
- Sanitized user inputs

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Deployment
1. Build production assets (if needed)
2. Set environment variables on server
3. Start server with `npm start`
4. Configure reverse proxy (nginx/Apache)

## 📝 API Documentation

### GET `/api/members/count`
Returns the total number of registered members.

**Response:**
```json
{
  "success": true,
  "count": 42
}
```

### POST `/api/join`
Register a new member.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "branch": "CSE",
  "section": "A",
  "interest": "Game Design",
  "message": "Excited to join!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully joined the guild!"
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Use 2 spaces for indentation
- Follow existing code patterns
- Add comments for complex logic
- Test on multiple browsers and devices

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Game Smiths Club Team**
- Developed by: Raj
- GitHub: [@AkshayRaj367](https://github.com/AkshayRaj367)

## 🙏 Acknowledgments

- Chrome Dino Run game for inspiration
- GSAP for amazing animation library
- Cloudinary for media hosting
- MongoDB for database services
- The retro gaming community

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Contact through the website form
- Email: [Your club email]

---

**Made with ❤️ and 🎮 by Game Smiths Club**
  --c-green: #00ff99;
  /* ... */
}
```

### Content
- **Team Members**: Edit the About section in `index.html`
- **Projects**: Update project cards in the Projects section
- **Events**: Modify timeline items in the Events section
- **Social Links**: Update Discord/Instagram/Email links in Contact section

### Launch Date
The countdown automatically calculates to October 17 of the current or next year. To change:
- Edit the `nextOct17()` function in `script.js`

## 🎯 Easter Eggs

- **Spacebar**: Makes the hero dino jump
- **Footer Dino**: Randomly hops as it runs across the screen
- **Pixel Rain**: Occasional neon pixels fall from the top

## 📦 Dependencies

All loaded via CDN:
- **GSAP 3**: Scroll animations and reveals
- **Google Fonts**: Press Start 2P (pixel font) + Inter

## 🌐 Deployment

Deploy to any static hosting service:
- **GitHub Pages**: Push to repo and enable Pages
- **Netlify**: Drag and drop the folder
- **Vercel**: Connect your repo
- **Surge**: `surge .` from project directory

## 📝 License

Created for Game Smiths Club © 2025

---

**Forging the Future of Games, One Pixel at a Time** 🎮✨
