/* ========== CHARTHUSTLEZ.ONLINE LANDING PAGE SCRIPT ========== */

// Matrix characters - binary, katakana, symbols, and code glyphs
const MATRIX_CHARS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン$%&@#*+=<>{}[]|^~";

// Snowflake symbols
const SNOW_CHARS = ["\u2744", "\u2746", "\u2745", "\u00B7", "\u2022", "*"];

// Theme configuration
const THEMES = ['green', 'cyan', 'magenta', 'amber', 'red'];
const THEME_COLORS = {
  green:   { primary: '#6bff2a', rgb: [107, 255, 42] },
  cyan:    { primary: '#17c5d0', rgb: [23, 197, 208] },
  magenta: { primary: '#d42abf', rgb: [212, 42, 191] },
  amber:   { primary: '#d4a017', rgb: [212, 160, 23] },
  red:     { primary: '#d42a3f', rgb: [212, 42, 63] },
};

// Configuration
const CONFIG = {
  snowCount: window.innerWidth < 768 ? 50 : 80,
  portalDuration: 4000,
  portalSnowCount: 30,
};

// ========== LOADING PORTAL ==========
function initPortal() {
  const canvas = document.getElementById('portal-canvas');
  const ctx = canvas.getContext('2d');
  const portalContent = document.getElementById('portal-content');
  const portalRing = document.getElementById('portal-ring');
  const loadingBar = document.getElementById('loading-bar');
  const loadingText = document.getElementById('loading-text');
  const loadingPortal = document.getElementById('loading-portal');
  const landingPage = document.getElementById('landing-page');

  // Set canvas size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Matrix rain on portal (falls from top)
  const fontSize = 14;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = Array(columns).fill(0).map(() => Math.random() * -50);

  function drawMatrixRain() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#6bff2a';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];

      // Bright head character
      ctx.fillStyle = '#fff';
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);

      // Trailing characters in theme color
      ctx.fillStyle = primaryColor;
      ctx.globalAlpha = 0.7;
      ctx.fillText(char, i * fontSize, (drops[i] - 1) * fontSize);
      ctx.globalAlpha = 1;

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i] += 0.5 + Math.random() * 0.5;
    }
  }

  const matrixInterval = setInterval(drawMatrixRain, 40);

  // Portal snowflakes rising from bottom
  initPortalSnowflakes();

  // Portal animation phases
  setTimeout(() => portalContent.classList.add('visible'), 200);
  setTimeout(() => portalRing.classList.add('expanded'), 1200);

  // Loading progress with status messages
  const statusMessages = [
    'Initializing',
    'Decrypting',
    'Loading matrix',
    'Syncing data',
    'Establishing link',
    'Entering',
  ];
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += 1.2;
    if (progress > 100) progress = 100;
    loadingBar.style.width = progress + '%';

    const msgIndex = Math.min(Math.floor(progress / 20), statusMessages.length - 1);
    loadingText.textContent = progress < 100
      ? `${statusMessages[msgIndex]}... ${Math.floor(progress)}%`
      : 'Entering...';
  }, CONFIG.portalDuration / 100);

  // Auto-enter after duration
  setTimeout(() => {
    clearInterval(matrixInterval);
    clearInterval(progressInterval);

    loadingPortal.classList.add('fade-out');

    setTimeout(() => {
      loadingPortal.classList.add('hidden');
      landingPage.classList.remove('hidden');

      // Show caution tapes
      const cautionTapes = document.getElementById('caution-tapes');
      if (cautionTapes) cautionTapes.style.display = '';

      initLandingPage();
    }, 1200);
  }, CONFIG.portalDuration);
}

// ========== PORTAL SNOWFLAKES ==========
function initPortalSnowflakes() {
  const container = document.getElementById('portal-snowflakes');
  const flakes = [];

  for (let i = 0; i < CONFIG.portalSnowCount; i++) {
    const flake = document.createElement('span');
    flake.className = 'portal-snowflake';
    flake.textContent = SNOW_CHARS[Math.floor(Math.random() * SNOW_CHARS.length)];

    const size = Math.random() * 10 + 8;
    const x = Math.random() * 100;
    const speed = Math.random() * 0.6 + 0.2;
    const drift = Math.random() * 0.3 - 0.15;

    flake.style.fontSize = size + 'px';
    flake.style.left = x + '%';
    flake.style.bottom = '-5%';
    flake.style.opacity = Math.random() * 0.5 + 0.3;

    container.appendChild(flake);
    flakes.push({ el: flake, x, y: 100 + Math.random() * 20, speed, drift });
  }

  function animate() {
    flakes.forEach(f => {
      f.y -= f.speed * 0.4;
      f.x += f.drift * 0.3;
      if (f.y < -5) {
        f.y = 105;
        f.x = Math.random() * 100;
      }
      if (f.x > 100) f.x = 0;
      if (f.x < 0) f.x = 100;
      f.el.style.bottom = (100 - f.y) + '%';
      f.el.style.left = f.x + '%';
    });
    if (!document.getElementById('loading-portal').classList.contains('hidden')) {
      requestAnimationFrame(animate);
    }
  }

  animate();
}

// ========== LANDING PAGE ==========
function initLandingPage() {
  initMatrixCanvas();
  initSnowflakes();
  initThemeToggle();
  initSpeedToggle();
  initCTAButton();
  initEntranceAnimations();
}

// ========== MATRIX RAIN CANVAS (Falling from top) ==========
function initMatrixCanvas() {
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const fontSize = 16;
  let columns = Math.floor(canvas.width / fontSize);
  let drops = Array(columns).fill(0).map(() => Math.random() * -canvas.height / fontSize);

  window.addEventListener('resize', () => {
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(0).map(() => Math.random() * -canvas.height / fontSize);
  });

  function getThemeColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#6bff2a';
  }

  // Speed presets: [baseSpeed, jitter, fadeRate]
  const SPEED_PRESETS = {
    slow:   { base: 0.12, jitter: 0.08, fade: 0.04, label: 'SLOW' },
    normal: { base: 0.25, jitter: 0.15, fade: 0.07, label: 'NORMAL' },
    fast:   { base: 0.50, jitter: 0.25, fade: 0.12, label: 'FAST' },
  };
  const SPEED_ORDER = ['slow', 'normal', 'fast'];

  // Current speed - start at normal
  let currentSpeedKey = localStorage.getItem('charthustlez-speed') || 'normal';
  if (!SPEED_PRESETS[currentSpeedKey]) currentSpeedKey = 'normal';
  let currentSpeed = SPEED_PRESETS[currentSpeedKey];

  // Expose speed setter for toggle UI
  window._setMatrixSpeed = function(key) {
    if (!SPEED_PRESETS[key]) return;
    currentSpeedKey = key;
    currentSpeed = SPEED_PRESETS[key];
    localStorage.setItem('charthustlez-speed', key);
  };
  window._getMatrixSpeed = function() { return currentSpeedKey; };

  // Random pulse state
  let globalPulse = 1;
  let pulseTarget = 1;
  let pulseVelocity = 0;
  const pulseMin = 0.08;
  const pulseMax = 1.0;

  // Schedule random pulse events
  function schedulePulse() {
    const delay = 600 + Math.random() * 2500;
    setTimeout(() => {
      pulseTarget = Math.random() < 0.5 ? (pulseMin + Math.random() * 0.2) : (0.65 + Math.random() * 0.35);
      schedulePulse();
    }, delay);
  }
  schedulePulse();

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, ' + currentSpeed.fade + ')';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Smooth lerp toward pulse target with springiness
    pulseVelocity += (pulseTarget - globalPulse) * 0.025;
    pulseVelocity *= 0.9;
    globalPulse += pulseVelocity;
    globalPulse = Math.max(pulseMin, Math.min(pulseMax, globalPulse));

    const color = getThemeColor();
    ctx.font = fontSize + 'px monospace';

    const speed = currentSpeed;

    for (let i = 0; i < drops.length; i++) {
      if (Math.random() > 0.6) {
        drops[i] += speed.base + Math.random() * speed.jitter;
        continue;
      }

      const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // Per-column jitter on the pulse for organic randomness
      const localPulse = globalPulse * (0.75 + Math.random() * 0.5);

      ctx.fillStyle = 'rgba(255, 255, 255, ' + (0.7 * localPulse) + ')';
      ctx.fillText(char, x, y);

      ctx.fillStyle = color;
      ctx.globalAlpha = 0.35 * localPulse;
      const trailChar = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
      ctx.fillText(trailChar, x, y - fontSize);
      ctx.globalAlpha = 0.15 * localPulse;
      ctx.fillText(trailChar, x, y - fontSize * 2);
      ctx.globalAlpha = 0.06 * localPulse;
      ctx.fillText(trailChar, x, y - fontSize * 3);
      ctx.globalAlpha = 1;

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = Math.random() * -15;
      }
      drops[i] += speed.base + Math.random() * speed.jitter;
    }

    requestAnimationFrame(draw);
  }

  draw();
}

// ========== SNOWFLAKES (Rising from bottom) ==========
function initSnowflakes() {
  const container = document.getElementById('snowflakes');
  const flakes = [];

  for (let i = 0; i < CONFIG.snowCount; i++) {
    const flake = document.createElement('span');
    flake.className = 'snowflake';
    flake.textContent = SNOW_CHARS[Math.floor(Math.random() * SNOW_CHARS.length)];

    const x = Math.random() * 100;
    const y = Math.random() * 120;
    const speed = Math.random() * 0.8 + 0.2;
    const drift = Math.random() * 0.5 - 0.25;
    const size = Math.random() * 12 + 8;
    const opacity = Math.random() * 0.5 + 0.3;
    const wobbleSpeed = Math.random() * 0.02 + 0.01;
    const wobbleAmp = Math.random() * 1.5 + 0.5;

    flake.style.left = x + '%';
    flake.style.bottom = '-5%';
    flake.style.fontSize = size + 'px';
    flake.style.opacity = opacity;

    container.appendChild(flake);
    flakes.push({ el: flake, x, y, speed, drift, wobbleSpeed, wobbleAmp, time: Math.random() * 100 });
  }

  function animateSnowflakes() {
    flakes.forEach(f => {
      f.y -= f.speed * 0.25;
      f.time += f.wobbleSpeed;
      f.x += Math.sin(f.time) * f.wobbleAmp * 0.05 + f.drift * 0.1;

      if (f.y < -10) {
        f.y = 110;
        f.x = Math.random() * 100;
        f.el.textContent = SNOW_CHARS[Math.floor(Math.random() * SNOW_CHARS.length)];
      }
      if (f.x > 102) f.x = -2;
      if (f.x < -2) f.x = 102;

      f.el.style.bottom = (100 - f.y) + '%';
      f.el.style.left = f.x + '%';
    });
    requestAnimationFrame(animateSnowflakes);
  }

  animateSnowflakes();
}

// ========== THEME TOGGLE ==========
function initThemeToggle() {
  const cycleBtn = document.getElementById('theme-cycle');
  const drawer = document.getElementById('theme-drawer');
  const themeLabel = document.getElementById('theme-label');
  const themeButtons = document.querySelectorAll('.theme-btn');

  // Load saved theme
  const savedTheme = localStorage.getItem('charthustlez-theme') || 'green';
  applyTheme(savedTheme);

  // Toggle drawer open/close
  cycleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    drawer.classList.toggle('open');
  });

  // Close drawer when clicking outside
  document.addEventListener('click', () => {
    drawer.classList.remove('open');
  });

  drawer.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Theme button clicks
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      applyTheme(theme);
      localStorage.setItem('charthustlez-theme', theme);
      drawer.classList.remove('open');
    });
  });

  // Keyboard shortcut: T to cycle themes
  document.addEventListener('keydown', (e) => {
    if (e.key === 't' || e.key === 'T') {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const currentTheme = document.body.getAttribute('data-theme') || 'green';
      const currentIndex = THEMES.indexOf(currentTheme);
      const nextIndex = (currentIndex + 1) % THEMES.length;
      applyTheme(THEMES[nextIndex]);
      localStorage.setItem('charthustlez-theme', THEMES[nextIndex]);
    }
  });

  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    themeLabel.textContent = theme.toUpperCase();

    themeButtons.forEach(b => {
      b.classList.toggle('active', b.dataset.theme === theme);
    });
  }
}

// ========== SPEED TOGGLE ==========
function initSpeedToggle() {
  const speedBtns = document.querySelectorAll('.speed-btn');
  const speedLabel = document.getElementById('speed-label');
  const speedCycleBtn = document.getElementById('speed-cycle');
  const speedDrawer = document.getElementById('speed-drawer');

  if (!speedCycleBtn) return;

  // Apply saved speed
  const saved = window._getMatrixSpeed();
  updateSpeedUI(saved);

  // Toggle drawer
  speedCycleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    speedDrawer.classList.toggle('open');
    // Close theme drawer if open
    const themeDrawer = document.getElementById('theme-drawer');
    if (themeDrawer) themeDrawer.classList.remove('open');
  });

  // Close on outside click
  document.addEventListener('click', () => {
    speedDrawer.classList.remove('open');
  });
  speedDrawer.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Speed button clicks
  speedBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.speed;
      window._setMatrixSpeed(key);
      updateSpeedUI(key);
      speedDrawer.classList.remove('open');
    });
  });

  // Keyboard shortcut: S to cycle speed
  document.addEventListener('keydown', (e) => {
    if (e.key === 's' || e.key === 'S') {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const order = ['slow', 'normal', 'fast'];
      const current = window._getMatrixSpeed();
      const next = order[(order.indexOf(current) + 1) % order.length];
      window._setMatrixSpeed(next);
      updateSpeedUI(next);
    }
  });

  function updateSpeedUI(key) {
    speedLabel.textContent = key.toUpperCase();
    speedBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.speed === key);
    });
  }
}

// ========== TYPEWRITER + ENTRANCE ANIMATIONS ==========
function initEntranceAnimations() {
  const tagline = document.getElementById('hero-tagline');
  const ctaBox = document.getElementById('cta-box');
  const speedBox = document.getElementById('speed-toggle-box');
  const themeBox = document.getElementById('theme-toggle-box');
  const fullText = 'From Beginner to Builder';
  let charIndex = 0;

  // Start typewriter after a short delay
  setTimeout(() => {
    tagline.style.opacity = '1';
    tagline.classList.add('typing');

    const typeInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        tagline.textContent += fullText[charIndex];
        charIndex++;
      } else {
        clearInterval(typeInterval);
        // Typing done - switch to flash mode
        setTimeout(() => {
          tagline.classList.remove('typing');
          tagline.classList.add('typed');
        }, 400);
      }
    }, 80);
  }, 300);

  // Stagger the slide-in of the three trapezoid boxes
  const boxes = [ctaBox, speedBox, themeBox].filter(Boolean);
  boxes.forEach((box, i) => {
    setTimeout(() => {
      box.classList.add('slide-in');
    }, 800 + i * 250);
  });
}

// ========== CTA BUTTON ==========
function initCTAButton() {
  const ctaBtn = document.getElementById('cta-btn');
  ctaBtn.addEventListener('click', () => {
    window.location.href = 'signup.html';
  });
}

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', initPortal);

// Handle window resize for portal canvas
window.addEventListener('resize', () => {
  const canvas = document.getElementById('portal-canvas');
  if (canvas && !document.getElementById('loading-portal').classList.contains('hidden')) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});
