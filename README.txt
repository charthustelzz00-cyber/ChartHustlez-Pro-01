# ChartHustlez Cyber Launch 🚀

An interactive, cyber-themed landing page featuring a cinematic portal entry,
theme-aware visuals, animated FX, and accessibility controls -- built to run
smoothly on desktop and mobile (including iOS Safari).

---

## ✨ Features

### 🌀 Portal Entry Experience
- Full-screen portal overlay on page load
- Cycling system messages (INITIALIZING, DECRYPTING, etc.)
- Animated progress bar
- Portal zoom-out + glitch sound on first interaction
- Safety timeout auto-exits portal if no interaction

### 🎨 Theme System
- Theme buttons (Green, Cyan, Magenta)
- Theme color affects:
  - UI accents
  - Portal glow
  - Matrix rain
- Theme is saved in `localStorage` and persists on reload

### 🧊 Visual FX
- **Matrix Canvas**
  - Numbers + cryptic symbols
  - Theme-colored
  - Optimized draw loop
- **Snow Particles**
  - Small flakes
  - Rise upward from bottom
  - Subtle sideways wind drift
- **Caution Tape**
  - Floating motion
  - Scrolling "billboard" text
  - Pulsing glow synced to theme

### ♿ Accessibility & Performance
- **Reduce Motion toggle**
  - Disables animations and motion
- **Disable FX toggle**
  - Turns off Matrix + Snow
- FX automatically pause during portal
- Throttled animation loop for mobile safety

---

## 📁 File Structure
##
File Structure
- index.html style.css
- script.js
# Page structure & Ul
# Styling, layout, animations
# Logic, portal, FX, themes
• sounds/
- glitch.mp3 # Portal glitch sound
- README.md

---

## ⚙️ How It Works (High Level)

### Portal Flow
1. Page loads → `body.locked`
2. Portal overlay appears
3. Text cycles + progress bar fills
4. First user interaction:
   - Glitch sound plays
   - Portal scales out
   - Site unlocks
5. FX start after portal exit

### FX Rendering
- Matrix & snow are rendered on `<canvas>`
- Shared animation loop
- Frame throttling (~20 FPS) for performance
- Respects accessibility toggles

---

## 📱 Mobile & Hosting Notes

- Designed to work on **iOS Safari**
- No external JS libraries
- Runs on shared hosting (e.g. Hostinger)
- Canvas size auto-resizes on orientation change

---

## 🛠 Customization Tips

- Change default theme color in `script.js`:
  ```js
  applyTheme('#00ff66');