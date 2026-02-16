# ChartHustlez Cyber Launch Page

A cyberpunk-style animated landing page built with HTML, CSS, and vanilla JavaScript.

## Features

* Cyber boot loading intro
* Matrix rain background animation
* Rising energy particles
* GPU glow particle system
* Neon scanline sweep
* Theme switcher (Green / Cyan / Magenta)
* Glitch pulse headline animation
* Email signup form (frontend demo)

## Project Structure

index.html
→ Page layout and UI elements

style.css
→ Themes, animations, and visual styling

script.js
→ All animations, particles, and interactivity

## How to Run

1. Download or clone the project
2. Open `index.html` in a browser
3. No build tools or dependencies required

## Customization

### Change Theme Colors

Edit variables inside:

style.css

```
body[data-theme="green"] {
  --primary: ...
}
```

### Adjust Animation Density

Inside `script.js`:

* Matrix intensity → change column/font size
* Glow particles → edit particle count
* Rising particles → adjust snowflake loop count

## Notes

All animations are designed to stay behind content using layered z-index and canvas rendering for performance.

## Future Ideas

* Backend email integration
* Countdown timer
* Mouse-reactive background
* Sound effects
