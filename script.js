/* ===== THEME SWITCHER ===== */
const root = document.documentElement;
let currentColor = '#00ff66'; // default green

document.querySelectorAll('[data-theme]').forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset.theme;

    if (theme === 'green') currentColor = '#00ff66';
    if (theme === 'cyan') currentColor = '#00ffff';
    if (theme === 'magenta') currentColor = '#ff00ff';

    root.style.setProperty('--primary', currentColor);

    // Update portal color live (if it exists)
    const portal = document.getElementById('portal-overlay');
    if (portal) {
      portal.style.background =
        `radial-gradient(circle at center, ${currentColor}, #020402 70%)`;
    }
  });
});

/* ===== TOGGLES ===== */
const reduceMotionToggle = document.getElementById('reduceMotion');
const disableFXToggle = document.getElementById('disableFX');

/* ===== PORTAL SYSTEM (HARDENED) ===== */
const portal = document.getElementById('portal-overlay');
const portalText = document.getElementById('portal-text');
const body = document.body;

body.classList.add('locked');

const portalMessages = [
  'INITIALIZING',
  'DECRYPTING',
  'SYNCING SIGNAL',
  'ENTERING SYSTEM'
];

let portalIndex = 0;
let portalInterval;

/* Cycle text */
function startPortalText() {
  portalInterval = setInterval(() => {
    portalIndex = (portalIndex + 1) % portalMessages.length;
    portalText.textContent = portalMessages[portalIndex];
  }, 700);
}

startPortalText();

/* Exit portal on first interaction */
function exitPortal() {
  if (reduceMotionToggle.checked || disableFXToggle.checked) {
    cleanupPortal();
    return;
  }

  portal.classList.add('portal-exit');

  setTimeout(cleanupPortal, 700);
}

function cleanupPortal() {
  clearInterval(portalInterval);
  portal.remove();
  body.classList.remove('locked');
}

document.addEventListener('pointerdown', exitPortal, { once: true });

/* ===== PORTAL ===== */
const portal = document.getElementById('portal-overlay');
const body = document.body;

const portalSeen = sessionStorage.getItem('portalSeen');

function exitPortal() {
  if (portalSeen || reduceMotionToggle.checked || disableFXToggle.checked) {
    portal.remove();
    body.classList.remove('locked');
    return;
  }

  sessionStorage.setItem('portalSeen', 'true');

  portal.classList.add('portal-exit');

  setTimeout(() => {
    portal.remove();
    body.classList.remove('locked');
  }, 700);
}

document.addEventListener('click', exitPortal, { once: true });

/* ===== CAUTION TEXT SCROLL ===== */
const tracks = document.querySelectorAll('.caution-track');
let scrollX = 0;

function scrollText() {
  if (!reduceMotionToggle.checked && !disableFXToggle.checked) {
    scrollX -= 0.35;
    tracks.forEach(t => t.style.transform = `translate3d(${scrollX}px,0,0)`);
    if (Math.abs(scrollX) > 400) scrollX = 0;
  }
  requestAnimationFrame(scrollText);
}
scrollText();