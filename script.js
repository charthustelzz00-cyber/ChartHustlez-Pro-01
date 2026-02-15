//* ========== CHARTHUSTLEZ LANDING PAGE SCRIPT ========== *//
// Matrix characters - binary, Japanese katakana, and symbols
const MATRIX_CHARS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン$%&@#*+=<>{}[]";

// Configuration
const CONFIG = {
  matrixCount: window.innerWidth < 768 ? 30 : 50,
  snowCount: window.innerWidth < 768 ? 40 : 60,
  portalDuration: 3000, // Auto-enter after 3 seconds
};

// ========== LOADING PORTAL ==========
function initPortal() {
  // Null checks for required elements
  const canvas = document.getElementById('portal-canvas');
  if (!canvas) {
    console.error('Portal canvas element not found');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Failed to get 2D context from canvas');
    return;
  }
  
  const portalContent = document.getElementById('portal-content');
  const portalRing = document.getElementById('portal-ring');
  const loadingBar = document.getElementById('loading-bar');
  const loadingText = document.getElementById('loading-text');
  const loadingPortal = document.getElementById('loading-portal');
  const landingPage = document.getElementById('landing-page');
  
  if (!portalContent || !portalRing || !loadingBar || !loadingText || !loadingPortal || !landingPage) {
    console.error('One or more required portal elements not found');
    return;
  }

  // Set canvas size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Matrix rain on portal
  const columns = Math.floor(canvas.width / 20);
  const drops = Array(columns).fill(1);
  
  // Get primary color once to avoid expensive recomputation in animation loop
  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#00ff00';

  function drawMatrixRain() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#00ff00';
    ctx.font = '15px monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
      ctx.fillText(char, i * 20, drops[i] * 20);

      if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  const matrixInterval = setInterval(drawMatrixRain, 35);

  // Portal animation phases
  setTimeout(() => portalContent.classList.add('visible'), 300);
  setTimeout(() => portalRing.classList.add('expanded'), 1000);

  // Loading progress
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += 2;
    if (progress > 100) progress = 100;
    loadingBar.style.width = progress + '%';
    loadingText.textContent = progress < 100 ? `Loading... ${progress}%` : 'Entering...';
  }, 50);

  // Auto-enter after duration
  setTimeout(() => {
    clearInterval(matrixInterval);
    clearInterval(progressInterval);
    
    loadingPortal.classList.add('fade-out');
    
    setTimeout(() => {
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

// ========== MATRIX RAIN (Falling from top) ==========
function initMatrixRain() {
  const container = document.getElementById('matrix-rain');
  if (!container) {
    console.error('Matrix rain container not found');
    return;
  }
  const chars = [];

  for (let i = 0; i < CONFIG.matrixCount; i++) {
    const char = document.createElement('span');
    char.className = 'matrix-char';
    char.textContent = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
    
    const x = Math.random() * 100;
    const y = Math.random() * -100;
    const speed = Math.random() * 2 + 1;
    const size = Math.random() * 12 + 10;
    const opacity = Math.random() * 0.5 + 0.5;
    
    char.style.left = x + '%';
    char.style.top = y + '%';
    char.style.fontSize = size + 'px';
    char.style.opacity = opacity;
    char.style.textShadow = '0 0 5px var(--primary)';
    
    container.appendChild(char);
    chars.push({ el: char, x, y, speed });
  }

  function animateMatrix() {
    chars.forEach(c => {
      c.y += c.speed * 0.3;
      if (c.y > 110) {
        c.y = -10;
        c.x = Math.random() * 100;
        c.el.textContent = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
      }
      c.el.style.top = c.y + '%';
      c.el.style.left = c.x + '%';
    });
    requestAnimationFrame(animateMatrix);
  }
  
  animateMatrix();
}

// ========== SNOWFLAKES (Rising from bottom) ==========
function initSnowflakes() {
  const container = document.getElementById('snowflakes-container');
  if (!container) {
    console.error('Snowflakes container not found');
    return;
  }
  const flakes = [];

  for (let i = 0; i < CONFIG.snowCount; i++) {
    const flake = document.createElement('span');
    flake.className = 'snowflake';
    flake.textContent = '❄';
    
    const x = Math.random() * 100;
    const y = 100 + Math.random() * 20;
    const speed = Math.random() * 0.8 + 0.3;
    const drift = Math.random() * 0.4 - 0.2;
    const size = Math.random() * 10 + 8;
    const opacity = Math.random() * 0.6 + 0.4;
    
    flake.style.left = x + '%';
    flake.style.bottom = (100 - y) + '%';
    flake.style.fontSize = size + 'px';
    flake.style.opacity = opacity;
    
    container.appendChild(flake);
    flakes.push({ el: flake, x, y, speed, drift });
  }

  function animateSnowflakes() {
    flakes.forEach(f => {
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
    });
    requestAnimationFrame(animateSnowflakes);
  }
  
  animateSnowflakes();
}

// ========== THEME TOGGLE ==========
function initThemeToggle() {
  const themeButtons = document.querySelectorAll('.theme-btn');
  
  if (themeButtons.length === 0) {
    console.warn('No theme buttons found');
    return;
  }
  
  try {
    // Load saved theme
    const savedTheme = localStorage.getItem('charthustlez-theme') || 'green';
    document.body.setAttribute('data-theme', savedTheme);
    
    // Update active button
    themeButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === savedTheme);
      
      btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('charthustlez-theme', theme);
        
        themeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  } catch (error) {
    console.error('Error initializing theme toggle:', error);
  }
}

// ========== CTA BUTTON ==========
function initCTAButton() {
  const ctaBtn = document.getElementById('cta-btn');
  
  if (!ctaBtn) {
    console.warn('CTA button element not found');
    return;
  }
  
  ctaBtn.addEventListener('click', () => {
    try {
      window.location.href = 'signup.html';
    } catch (error) {
      console.error('Error handling CTA button click:', error);
    }
  });
}

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', () => {
  try {
    initPortal();
  } catch (error) {
    console.error('Error initializing portal:', error);
  }
});

// Handle window resize
window.addEventListener('resize', () => {
  try {
    const canvas = document.getElementById('portal-canvas');
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  } catch (error) {
    console.error('Error handling window resize:', error);
  }
});