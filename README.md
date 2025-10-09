# 🎮 Game Smiths Club Website

A pixel-themed, retro-gaming inspired website for a college game development club. Features dynamic animations, parallax scrolling, and interactive elements inspired by the Chrome Dino Run game.

## ✨ Features

- **Pixel Art Aesthetic**: Retro gaming theme with neon color palette
- **Countdown Timer**: Live countdown to October 17 launch date
- **Parallax Scrolling**: Multi-layer background with depth
- **Animated Pixel Dino**: Running dino character with jump easter egg (press spacebar!)
- **Interactive Animations**: 
  - Cursor pixel trail
  - Pixel rain effects
  - Scroll-triggered reveals (GSAP)
  - 3D hover effects on cards
  - Flip cards in Projects section
- **Night/Day Mode Toggle**: Switch between dark and light themes
- **Music Toggle**: Optional background music (add your own chiptune!)
- **Fully Responsive**: Works on desktop, tablet, and mobile

## 🚀 Getting Started

### Frontend Only (Static)
1. **Open the project**: Simply open `index.html` in your browser
2. **No build required**: Pure HTML/CSS/JS with CDN dependencies

### With MongoDB Backend
1. **Install dependencies**: `npm install`
2. **Create .env file**: Copy `.env.example` to `.env` and add your MongoDB URI
3. **Start server**: `npm start`
4. **Open browser**: Navigate to `http://localhost:3000`

### Optional: Add Background Music
To enable the music toggle, add an audio file:
1. Add your chiptune/8-bit music file to the project folder
2. Update the `<audio>` tag in `index.html`:
   ```html
   <audio id="bgm" loop preload="auto">
     <source src="your-music-file.mp3" type="audio/mpeg" />
   </audio>
   ```

## 🎨 Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
  --c-cyan: #00ffff;
  --c-mag: #ff00ff;
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
