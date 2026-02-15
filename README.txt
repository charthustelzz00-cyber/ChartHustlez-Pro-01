ChartHustlez Cyber Landing Page
================================

INSTALLATION ON HOSTINGER:
1. Upload all 3 files (index.html, style.css, script.js) to your Hostinger public_html folder
2. That's it! Your site is ready.

FILES INCLUDED:
- index.html - Main HTML structure
- style.css - All styling and themes
- script.js - All animations and interactivity

FEATURES:
✓ Auto-loading portal (3 second animation, no click required)
✓ Matrix code falling from top (Japanese katakana + binary + symbols)
✓ Snowflakes rising from bottom
✓ 3 Theme options: Green, Cyan, Magenta (with toggle buttons)
✓ Theme preference saved in localStorage
✓ Glitch text effect on title
✓ Responsive design (mobile-friendly)
✓ Smooth animations throughout

CUSTOMIZATION:

Change Portal Duration:
- Open script.js
- Find: portalDuration: 3000
- Change 3000 to desired milliseconds (3000 = 3 seconds)

Change CTA Button Action:
- Open script.js
- Find: initCTAButton function
- Replace alert() with window.open('your-url', '_blank')

Change Theme Colors:
- Open style.css
- Modify the CSS variables in :root and [data-theme] sections

Add More Themes:
1. Add new [data-theme=\"name\"] section in style.css
2. Add new button in index.html theme-toggle div
3. Done!

PERFORMANCE:
- Matrix characters: 50 on desktop, 30 on mobile
- Snowflakes: 60 on desktop, 40 on mobile
- Canvas-based portal animation for smooth performance

Created for ChartHustlez.online