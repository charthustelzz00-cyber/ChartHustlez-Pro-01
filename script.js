/* ========== CHARTHUSTLEZ.ONLINE LANDING PAGE SCRIPT ========== */

// Matrix characters - binary, katakana, symbols, and code fragments
const MATRIX_CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン$%&@#*+=<>{}[]|/\\~^';

// Snowflake variations
const SNOWFLAKE_CHARS = ['\u2744', '\u2745', '\u2746', '\u00B7', '\u2022', '+', '\u2727'];

// Loading status messages
const STATUS_MESSAGES = [
  'ESTABLISHING CONNECTION',
  'DECRYPTING PROTOCOLS',
  'LOADING MATRIX CORE',
  'SYNCING DATA STREAMS',
  'INITIALIZING INTERFACE',
  'PREPARING PORTAL',
  'ACCESS GRANTED'
];

// Configuration
const CONFIG = {
  matrixFontSize: 14,
  snowCount: window.innerWidth < 768 ? 35 : 55,
  portalDuration: 4000,
};

// ========== THEME MANAGEMENT ==========
function getCurrentThemeColor() {
  return getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#00ff00';
}

function getThemeRGB() {
  const theme = document.body.getAttribute('data-theme') || 'green';
  switch (theme) {
    case 'cyan': return { r: 0, g: 255, b: 255 };
    case 'magenta': return { r: 255, g: 0, b: 255 };
    default: return { r: 61, g: 220, b: 132 };
  }
}

// ========== LOADING PORTAL ==========
function initPortal() {
  const matrixCanvas = document.getElementById('portal-canvas');
  const snowCanvas = document.getElementById('portal-snow-canvas');
  const matrixCtx = matrixCanvas.getContext('2d');
  const snowCtx = snowCanvas.getContext('2d');
  const portalContent = document.getElementById('portal-content');
  const portalRing = document.getElementById('portal-ring');
  const loadingBar = document.getElementById('loading-bar');
  const loadingBarGlow = document.getElementById('loading-bar-glow');
  const loadingText = document.getElementById('loading-text');
  const portalStatus = document.getElementById('portal-status');
  const loadingPortal = document.getElementById('loading-portal');
  const landingPage = document.getElementById('landing-page');

  // Load saved theme early
  const savedTheme = localStorage.getItem('charthustlez-theme') || 'green';
  document.body.setAttribute('data-theme', savedTheme);

  // Set canvas sizes
  function resizeCanvases() {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    snowCanvas.width = window.innerWidth;
    snowCanvas.height = window.innerHeight;
  }
  resizeCanvases();

  // --- Portal Matrix Rain (falling from top) ---
  const matrixColumns = Math.floor(matrixCanvas.width / CONFIG.matrixFontSize);
  const matrixDrops = [];
  for (let i = 0; i < matrixColumns; i++) {
    matrixDrops[i] = Math.random() * -50;
  }

  function drawPortalMatrix() {
    matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

    const rgb = getThemeRGB();
    matrixCtx.font = CONFIG.matrixFontSize + 'px monospace';

    for (let i = 0; i < matrixDrops.length; i++) {
      const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
      const x = i * CONFIG.matrixFontSize;
      const y = matrixDrops[i] * CONFIG.matrixFontSize;

      // Brighter head character
      const headAlpha = 0.9 + Math.random() * 0.1;
      matrixCtx.fillStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + headAlpha + ')';
      matrixCtx.fillText(char, x, y);

      // Trail character slightly dimmer
      if (matrixDrops[i] > 1) {
        const trailChar = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        matrixCtx.fillStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.3)';
        matrixCtx.fillText(trailChar, x, y - CONFIG.matrixFontSize);
      }

      if (y > matrixCanvas.height && Math.random() > 0.97) {
        matrixDrops[i] = 0;
      }
      matrixDrops[i] += 0.6 + Math.random() * 0.4;
    }
  }

  // --- Portal Snowflakes (rising from bottom) ---
  const snowParticles = [];
  const snowParticleCount = 60;
  for (let i = 0; i < snowParticleCount; i++) {
    snowParticles.push({
      x: Math.random() * snowCanvas.width,
      y: snowCanvas.height + Math.random() * snowCanvas.height,
      speed: 0.5 + Math.random() * 1.5,
      drift: (Math.random() - 0.5) * 0.8,
      size: 1 + Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.5,
    });
  }

  function drawPortalSnow() {
    snowCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);

    for (let i = 0; i < snowParticles.length; i++) {
      const p = snowParticles[i];
      snowCtx.beginPath();
      snowCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      snowCtx.fillStyle = 'rgba(255, 255, 255, ' + p.opacity + ')';
      snowCtx.fill();

      // Rise upward
      p.y -= p.speed;
      p.x += p.drift;

      // Reset when reaching top
      if (p.y < -10) {
        p.y = snowCanvas.height + 10;
        p.x = Math.random() * snowCanvas.width;
      }
      // Wrap horizontally
      if (p.x > snowCanvas.width) p.x = 0;
      if (p.x < 0) p.x = snowCanvas.width;
    }
  }

  // Combined portal animation loop
  let portalAnimId;
  function animatePortal() {
    drawPortalMatrix();
    drawPortalSnow();
    portalAnimId = requestAnimationFrame(animatePortal);
  }
  animatePortal();

  // Portal content animation phases
  setTimeout(function() { portalContent.classList.add('visible'); }, 200);
  setTimeout(function() { portalRing.classList.add('expanded'); }, 1200);

  // Loading progress with status messages
  let progress = 0;
  let statusIdx = 0;
  const progressInterval = setInterval(function() {
    progress += 1.5;
    if (progress > 100) progress = 100;

    const displayProgress = Math.floor(progress);
    loadingBar.style.width = displayProgress + '%';
    loadingBarGlow.style.width = displayProgress + '%';

    if (displayProgress < 100) {
      loadingText.textContent = 'INITIALIZING... ' + displayProgress + '%';
    } else {
      loadingText.textContent = 'ACCESS GRANTED';
      loadingText.style.animation = 'none';
      loadingText.style.opacity = '1';
    }

    // Update status messages at intervals
    const newStatusIdx = Math.min(Math.floor(progress / 15), STATUS_MESSAGES.length - 1);
    if (newStatusIdx !== statusIdx) {
      statusIdx = newStatusIdx;
      portalStatus.style.opacity = '0';
      setTimeout(function() {
        portalStatus.textContent = STATUS_MESSAGES[statusIdx];
        portalStatus.style.opacity = '0.4';
      }, 200);
    }
  }, CONFIG.portalDuration / 70);

  // Transition to main site
  setTimeout(function() {
    clearInterval(progressInterval);
    cancelAnimationFrame(portalAnimId);

    loadingPortal.classList.add('fade-out');

    setTimeout(function() {
      loadingPortal.classList.add('hidden');
      landingPage.classList.remove('hidden');
      initLandingPage();
    }, 1200);
  }, CONFIG.portalDuration);

  // Handle resize during portal
  window.addEventListener('resize', resizeCanvases);
}

// ========== LANDING PAGE ==========
function initLandingPage() {
  initMatrixCanvas();
  initSnowflakes();
  initThemeToggle();
  initCTAButton();
}

// ========== MATRIX RAIN CANVAS (Falling from top) ==========
function initMatrixCanvas() {
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();

  const fontSize = CONFIG.matrixFontSize;
  let columns = Math.floor(canvas.width / fontSize);
  let drops = [];

  function resetDrops() {
    columns = Math.floor(canvas.width / fontSize);
    drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }
  }
  resetDrops();

  function drawMatrix() {
    // Semi-transparent black to create trail fade
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const rgb = getThemeRGB();
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // Bright head
      ctx.fillStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0.95)';
      ctx.fillText(char, x, y);

      // Slightly dimmer secondary
      if (drops[i] > 2) {
        const char2 = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        ctx.fillStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0.4)';
        ctx.fillText(char2, x, y - fontSize * 2);
      }

      // Reset when past bottom
      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i] += 0.5 + Math.random() * 0.3;
    }

    requestAnimationFrame(drawMatrix);
  }

  drawMatrix();

  window.addEventListener('resize', function() {
    resizeCanvas();
    resetDrops();
  });
}

// ========== SNOWFLAKES (Rising from bottom) ==========
function initSnowflakes() {
  const container = document.getElementById('snowflakes');
  const flakes = [];

  for (let i = 0; i < CONFIG.snowCount; i++) {
    const flake = document.createElement('span');
    flake.className = 'snowflake';
    flake.textContent = SNOWFLAKE_CHARS[Math.floor(Math.random() * SNOWFLAKE_CHARS.length)];

    const x = Math.random() * 100;
    const y = Math.random() * 100; // start scattered across viewport
    const speed = 0.3 + Math.random() * 0.6;
    const drift = (Math.random() - 0.5) * 0.3;
    const size = 8 + Math.random() * 14;
    const opacity = 0.2 + Math.random() * 0.5;

    flake.style.left = x + '%';
    flake.style.bottom = y + '%';
    flake.style.fontSize = size + 'px';
    flake.style.opacity = opacity;

    container.appendChild(flake);
    flakes.push({
      el: flake,
      x: x,
      bottomPct: y,
      speed: speed,
      drift: drift,
    });
  }

  function animateSnowflakes() {
    for (let i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      // Rise upward (increase bottom %)
      f.bottomPct += f.speed * 0.15;
      f.x += f.drift * 0.1;

      // Reset when reaching top
      if (f.bottomPct > 105) {
        f.bottomPct = -5;
        f.x = Math.random() * 100;
        f.el.textContent = SNOWFLAKE_CHARS[Math.floor(Math.random() * SNOWFLAKE_CHARS.length)];
      }

      // Wrap horizontally
      if (f.x > 100) f.x = 0;
      if (f.x < 0) f.x = 100;

      f.el.style.bottom = f.bottomPct + '%';
      f.el.style.left = f.x + '%';
    }
    requestAnimationFrame(animateSnowflakes);
  }

  animateSnowflakes();
}

// ========== THEME TOGGLE ==========
function initThemeToggle() {
  const themeButtons = document.querySelectorAll('.theme-btn');

  // Load saved theme
  const savedTheme = localStorage.getItem('charthustlez-theme') || 'green';
  document.body.setAttribute('data-theme', savedTheme);

  // Set initial active state
  themeButtons.forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.theme === savedTheme);

    btn.addEventListener('click', function() {
      var theme = btn.dataset.theme;
      document.body.setAttribute('data-theme', theme);
      localStorage.setItem('charthustlez-theme', theme);

      themeButtons.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');

      // Clear matrix canvas to apply new theme immediately
      var matrixCanvas = document.getElementById('matrix-canvas');
      if (matrixCanvas) {
        var ctx = matrixCanvas.getContext('2d');
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      }
    });
  });
}

// ========== CTA BUTTON ==========
function initCTAButton() {
  var ctaBtn = document.getElementById('cta-btn');
  ctaBtn.addEventListener('click', function() {
    window.location.href = 'signup.html';
  });
}

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', initPortal);
