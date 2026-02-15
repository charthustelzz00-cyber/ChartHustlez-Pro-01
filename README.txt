Now let me create a **single combined file** that's easier to upload and won't have path issues:
Action: file_editor create /app/hostinger_files/index.html --file-text "<!DOCTYPE html>
<html lang=\"en\">
<head>
  <meta charset=\"UTF-8\">
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
  <meta name=\"description\" content=\"ChartHustlez - From Beginner to Builder\">
  <title>ChartHustlez | Cyber Launch</title>
  
  <!-- Google Fonts -->
  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">
  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>
  <link href=\"https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Share+Tech+Mono&display=swap\" rel=\"stylesheet\">
  
  <style>
    /* ========== CSS VARIABLES / THEMES ========== */
    :root {
      --primary: #00ff00;
      --secondary: #003300;
      --background: radial-gradient(ellipse at center, #0a1a0a 0%, #000000 100%);
      --glow: 0 0 20px #00ff00, 0 0 40px #00ff00;
      --text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00;
    }

    [data-theme=\"cyan\"] {
      --primary: #00ffff;
      --secondary: #003333;
      --background: radial-gradient(ellipse at center, #0a1a1a 0%, #000000 100%);
      --glow: 0 0 20px #00ffff, 0 0 40px #00ffff;
      --text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff;
    }

    [data-theme=\"magenta\"] {
      --primary: #ff00ff;
      --secondary: #330033;
      --background: radial-gradient(ellipse at center, #1a0a1a 0%, #000000 100%);
      --glow: 0 0 20px #ff00ff, 0 0 40px #ff00ff;
      --text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff;
    }

    /* ========== BASE STYLES ========== */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Share Tech Mono', monospace;
      background: #000;
      color: var(--primary);
      overflow-x: hidden;
    }

    .hidden {
      display: none !important;
    }

    /* ========== LOADING PORTAL ========== */
    .loading-portal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      overflow: hidden;
    }

    .loading-portal.fade-out {
      animation: portalFadeOut 1s ease-out forwards;
    }

    @keyframes portalFadeOut {
      0% { opacity: 1; }
      100% { opacity: 0; transform: scale(1.2); }
    }

    .portal-matrix-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.6;
    }

    .portal-content {
      position: relative;
      z-index: 10;
      text-align: center;
      opacity: 0;
      transform: scale(0.8);
      transition: all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .portal-content.visible {
      opacity: 1;
      transform: scale(1);
    }

    .portal-ring {
      width: 300px;
      height: 300px;
      border: 3px solid var(--primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: portalPulse 2s ease-in-out infinite;
      transition: all 1s ease;
      box-shadow: var(--glow);
    }

    .portal-ring.expanded {
      width: 400px;
      height: 400px;
      border-radius: 20px;
    }

    @keyframes portalPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .portal-inner {
      width: 90%;
      height: 90%;
      border-radius: inherit;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: var(--background);
    }

    .portal-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: 4px;
      color: var(--primary);
      text-shadow: var(--text-shadow);
      animation: glitchText 3s infinite;
    }

    .portal-subtitle {
      font-size: 0.9rem;
      margin-top: 15px;
      opacity: 0.8;
      color: var(--primary);
      animation: blink 1s infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 0.8; }
      50% { opacity: 0.3; }
    }

    .loading-bar-container {
      width: 80%;
      height: 4px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      margin-top: 20px;
      overflow: hidden;
    }

    .loading-bar {
      height: 100%;
      width: 0%;
      border-radius: 2px;
      background-color: var(--primary);
      box-shadow: var(--glow);
      transition: width 0.1s ease-out;
    }

    /* ========== LANDING PAGE ========== */
    .landing-page {
      min-height: 100vh;
      position: relative;
      overflow: hidden;
      background: var(--background);
      animation: pageEnter 1s ease-out;
    }

    @keyframes pageEnter {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* ========== MATRIX RAIN ========== */
    .matrix-rain {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      overflow: hidden;
    }

    .matrix-char {
      position: absolute;
      font-family: 'Share Tech Mono', monospace;
      font-weight: bold;
      color: var(--primary);
      will-change: top;
    }

    /* ========== SNOWFLAKES ========== */
    .snowflakes-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2;
      overflow: hidden;
    }

    .snowflake {
      position: absolute;
      color: rgba(255, 255, 255, 0.9);
      text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
      will-change: bottom, left;
    }

    /* ========== THEME TOGGLE ========== */
    .theme-toggle {
      position: fixed;
      top: 20px;
      right: 20px;
      display: flex;
      gap: 10px;
      z-index: 100;
    }

    .theme-btn {
      padding: 10px 20px;
      background: transparent;
      border: 2px solid var(--primary);
      color: var(--primary);
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
    }

    .theme-btn:hover {
      transform: translateY(-2px);
    }

    .theme-btn.active {
      font-weight: bold;
      background: var(--secondary);
      box-shadow: var(--glow);
    }

    /* ========== MARQUEE ========== */
    .marquee-container {
      position: absolute;
      top: 80px;
      left: 0;
      width: 100%;
      overflow: hidden;
      z-index: 5;
    }

    .marquee-container.bottom {
      top: auto;
      bottom: 30px;
    }

    .marquee {
      display: flex;
      white-space: nowrap;
      animation: marquee 20s linear infinite;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.9rem;
      letter-spacing: 3px;
      opacity: 0.6;
      color: var(--primary);
    }

    .marquee span {
      padding-right: 50px;
    }

    .marquee.reverse {
      animation-direction: reverse;
    }

    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    /* ========== HERO SECTION ========== */
    .hero-section {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      padding: 20px;
    }

    .hero-title {
      font-family: 'Orbitron', sans-serif;
      font-size: clamp(2.5rem, 8vw, 6rem);
      font-weight: 900;
      letter-spacing: 8px;
      margin-bottom: 20px;
      color: var(--primary);
      text-shadow: var(--text-shadow);
      animation: glitchText 5s infinite;
    }

    @keyframes glitchText {
      0%, 90%, 100% {
        transform: translate(0);
        filter: blur(0);
      }
      92% {
        transform: translate(-2px, 2px);
        filter: blur(1px);
      }
      94% {
        transform: translate(2px, -2px);
        filter: blur(0);
      }
      96% {
        transform: translate(-1px, -1px);
        filter: blur(1px);
      }
      98% {
        transform: translate(1px, 1px);
        filter: blur(0);
      }
    }

    .hero-tagline {
      font-size: clamp(1rem, 3vw, 1.5rem);
      letter-spacing: 4px;
      margin-bottom: 40px;
      opacity: 0.9;
      color: var(--primary);
    }

    .cta-button {
      padding: 18px 50px;
      background: transparent;
      border: 3px solid var(--primary);
      color: var(--primary);
      font-family: 'Orbitron', sans-serif;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 3px;
      box-shadow: var(--glow);
    }

    .cta-button:hover {
      transform: scale(1.08);
      background: rgba(255, 255, 255, 0.1);
    }

    /* ========== RESPONSIVE ========== */
    @media (max-width: 768px) {
      .theme-toggle {
        top: 10px;
        right: 10px;
        flex-wrap: wrap;
        gap: 5px;
      }

      .theme-btn {
        padding: 8px 12px;
        font-size: 0.75rem;
      }

      .marquee-container {
        top: 60px;
      }

      .marquee-container.bottom {
        bottom: 20px;
      }

      .portal-ring {
        width: 250px;
        height: 250px;
      }

      .portal-ring.expanded {
        width: 320px;
        height: 320px;
      }

      .portal-title {
        font-size: 1.5rem;
      }

      .cta-button {
        padding: 15px 35px;
        font-size: 0.95rem;
      }
    }

    @media (max-width: 480px) {
      .theme-toggle {
        position: fixed;
        top: auto;
        bottom: 70px;
        right: 50%;
        transform: translateX(50%);
      }

      .hero-title {
        letter-spacing: 4px;
      }

      .hero-tagline {
        font-size: 0.9rem;
        letter-spacing: 2px;
      }
    }
  </style>
</head>
<body>
  <!-- Loading Portal -->
  <div id=\"loading-portal\" class=\"loading-portal\">
    <canvas id=\"portal-canvas\" class=\"portal-matrix-canvas\"></canvas>
    
    <div class=\"portal-content\" id=\"portal-content\">
      <div class=\"portal-ring\" id=\"portal-ring\">
        <div class=\"portal-inner\">
          <h1 class=\"portal-title\">CHART HUSTLEZ</h1>
          <p class=\"portal-subtitle\" id=\"loading-text\">Loading... 0%</p>
          <div class=\"loading-bar-container\">
            <div class=\"loading-bar\" id=\"loading-bar\"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Main Landing Page -->
  <div id=\"landing-page\" class=\"landing-page hidden\">
    <!-- Matrix Rain Container -->
    <div id=\"matrix-rain\" class=\"matrix-rain\"></div>
    
    <!-- Snowflakes Container -->
    <div id=\"snowflakes\" class=\"snowflakes-container\"></div>
    
    <!-- Theme Toggle -->
    <div class=\"theme-toggle\" id=\"theme-toggle\">
      <button class=\"theme-btn active\" data-theme=\"green\">Green</button>
      <button class=\"theme-btn\" data-theme=\"cyan\">Cyan</button>
      <button class=\"theme-btn\" data-theme=\"magenta\">Magenta</button>
    </div>
    
    <!-- Top Marquee -->
    <div class=\"marquee-container\">
      <div class=\"marquee\">
        <span>CHART HUSTLEZ - LAUNCHING - CHART HUSTLEZ - LAUNCHING - CHART HUSTLEZ - LAUNCHING - CHART HUSTLEZ - LAUNCHING -</span>
        <span>CHART HUSTLEZ - LAUNCHING - CHART HUSTLEZ - LAUNCHING - CHART HUSTLEZ - LAUNCHING - CHART HUSTLEZ - LAUNCHING -</span>
      </div>
    </div>
    
    <!-- Hero Section -->
    <div class=\"hero-section\">
      <h1 class=\"hero-title glitch\">ChartHustlez</h1>
      <p class=\"hero-tagline\">From Beginner to Builder</p>
      <button class=\"cta-button\" id=\"cta-btn\">Join the Launch</button>
    </div>
    
    <!-- Bottom Marquee -->
    <div class=\"marquee-container bottom\">
      <div class=\"marquee reverse\">
        <span>CHART HUSTLEZ - LAUNCHING - CHART HUSTLEZ - LAUNCHING - CHART HUSTLEZ - LAUNCHING - CHART HUSTLEZ - LAUNCHING -</span>
        <span>CHART HUSTLEZ - LAUNCHING - CHART HUSTLEZ - LAUNCHING - CHART HUSTLEZ - LAUNCHING - CHART HUSTLEZ - LAUNCHING -</span>
      </div>
    </div>
  </div>
  
  <script>
    /* ========== CHARTHUSTLEZ LANDING PAGE SCRIPT ========== */

    // Matrix characters - binary, symbols, and letters
    var MATRIX_CHARS = \"01ABCDEFGHIJKLMNOPQRSTUVWXYZ$%&@#*+=<>{}[]0123456789\";

    // Configuration
    var CONFIG = {
      matrixCount: window.innerWidth < 768 ? 30 : 50,
      snowCount: window.innerWidth < 768 ? 40 : 60,
      portalDuration: 3000
    };

    // ========== LOADING PORTAL ==========
    function initPortal() {
      var canvas = document.getElementById('portal-canvas');
      var ctx = canvas.getContext('2d');
      var portalContent = document.getElementById('portal-content');
      var portalRing = document.getElementById('portal-ring');
      var loadingBar = document.getElementById('loading-bar');
      var loadingText = document.getElementById('loading-text');
      var loadingPortal = document.getElementById('loading-portal');
      var landingPage = document.getElementById('landing-page');

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      var columns = Math.floor(canvas.width / 20);
      var drops = [];
      for (var i = 0; i < columns; i++) { drops[i] = 1; }

      function drawMatrixRain() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff00';
        ctx.font = '15px monospace';

        for (var i = 0; i < drops.length; i++) {
          var char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
          ctx.fillText(char, i * 20, drops[i] * 20);

          if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }

      var matrixInterval = setInterval(drawMatrixRain, 35);

      setTimeout(function() { portalContent.classList.add('visible'); }, 300);
      setTimeout(function() { portalRing.classList.add('expanded'); }, 1000);

      var progress = 0;
      var progressInterval = setInterval(function() {
        progress += 2;
        if (progress > 100) progress = 100;
        loadingBar.style.width = progress + '%';
        loadingText.textContent = progress < 100 ? 'Loading... ' + progress + '%' : 'Entering...';
      }, 50);

      setTimeout(function() {
        clearInterval(matrixInterval);
        clearInterval(progressInterval);
        
        loadingPortal.classList.add('fade-out');
        
        setTimeout(function() {
          loadingPortal.classList.add('hidden');
          landingPage.classList.remove('hidden');
          initLandingPage();
        }, 1000);
      }, CONFIG.portalDuration);
    }

    // ========== LANDING PAGE ==========
    function initLandingPage() {
      initMatrixRain();
      initSnowflakes();
      initThemeToggle();
      initCTAButton();
    }

    // ========== MATRIX RAIN ==========
    function initMatrixRain() {
      var container = document.getElementById('matrix-rain');
      var chars = [];

      for (var i = 0; i < CONFIG.matrixCount; i++) {
        var char = document.createElement('span');
        char.className = 'matrix-char';
        char.textContent = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        
        var x = Math.random() * 100;
        var y = Math.random() * -100;
        var speed = Math.random() * 2 + 1;
        var size = Math.random() * 12 + 10;
        var opacity = Math.random() * 0.5 + 0.5;
        
        char.style.left = x + '%';
        char.style.top = y + '%';
        char.style.fontSize = size + 'px';
        char.style.opacity = opacity;
        char.style.textShadow = '0 0 5px var(--primary)';
        
        container.appendChild(char);
        chars.push({ el: char, x: x, y: y, speed: speed });
      }

      function animateMatrix() {
        for (var i = 0; i < chars.length; i++) {
          var c = chars[i];
          c.y += c.speed * 0.3;
          if (c.y > 110) {
            c.y = -10;
            c.x = Math.random() * 100;
            c.el.textContent = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
          }
          c.el.style.top = c.y + '%';
          c.el.style.left = c.x + '%';
        }
        requestAnimationFrame(animateMatrix);
      }
      
      animateMatrix();
    }

    // ========== SNOWFLAKES ==========
    function initSnowflakes() {
      var container = document.getElementById('snowflakes');
      var flakes = [];

      for (var i = 0; i < CONFIG.snowCount; i++) {
        var flake = document.createElement('span');
        flake.className = 'snowflake';
        flake.innerHTML = '&#10052;';
        
        var x = Math.random() * 100;
        var y = 100 + Math.random() * 20;
        var speed = Math.random() * 0.8 + 0.3;
        var drift = Math.random() * 0.4 - 0.2;
        var size = Math.random() * 10 + 8;
        var opacity = Math.random() * 0.6 + 0.4;
        
        flake.style.left = x + '%';
        flake.style.bottom = (100 - y) + '%';
        flake.style.fontSize = size + 'px';
        flake.style.opacity = opacity;
        
        container.appendChild(flake);
        flakes.push({ el: flake, x: x, y: y, speed: speed, drift: drift });
      }

      function animateSnowflakes() {
        for (var i = 0; i < flakes.length; i++) {
          var f = flakes[i];
          f.y -= f.speed * 0.3;
          f.x += f.drift * 0.3;
          
          if (f.y < -5) {
            f.y = 105;
            f.x = Math.random() * 100;
          }
          if (f.x > 100) f.x = 0;
          if (f.x < 0) f.x = 100;
          
          f.el.style.bottom = (100 - f.y) + '%';
          f.el.style.left = f.x + '%';
        }
        requestAnimationFrame(animateSnowflakes);
      }
      
      animateSnowflakes();
    }

    // ========== THEME TOGGLE ==========
    function initThemeToggle() {
      var themeButtons = document.querySelectorAll('.theme-btn');
      
      var savedTheme = localStorage.getItem('charthustlez-theme') || 'green';
      document.body.setAttribute('data-theme', savedTheme);
      
      for (var i = 0; i < themeButtons.length; i++) {
        var btn = themeButtons[i];
        if (btn.getAttribute('data-theme') === savedTheme) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
        
        btn.addEventListener('click', function() {
          var theme = this.getAttribute('data-theme');
          document.body.setAttribute('data-theme', theme);
          localStorage.setItem('charthustlez-theme', theme);
          
          for (var j = 0; j < themeButtons.length; j++) {
            themeButtons[j].classList.remove('active');
          }
          this.classList.add('active');
        });
      }
    }

    // ========== CTA BUTTON ==========
    function initCTAButton() {
      var ctaBtn = document.getElementById('cta-btn');
      ctaBtn.addEventListener('click', function() {
        alert('Coming Soon! Stay tuned for the launch.');
      });
    }

    // ========== INITIALIZE ==========
    document.addEventListener('DOMContentLoaded', initPortal);

    window.addEventListener('resize', function() {
      var canvas = document.getElementById('portal-canvas');
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    });
  </script>
</body>
</html>
"
Observation: Overwrite successful: /app/hostinger_files/index.html