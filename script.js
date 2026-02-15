/* =========================
   SAFE CORE REFERENCES
========================= */
const root = document.documentElement;
const body = document.body;

/* =========================
   THEME SYSTEM (GUARANTEED)
========================= */
let currentColor = '#00ff66';

function applyTheme(color) {
  currentColor = color;
  root.style.setProperty('--primary', currentColor);

  const portal = document.getElementById('portal-overlay');
  if (portal) {
    portal.style.background =
      `radial-gradient(circle at center, ${currentColor}, #020402 70%)`;
  }
}

document.querySelectorAll('[data-theme]').forEach(btn => {
  btn.addEventListener('click', () => {
    const t = btn.dataset.theme;
    if (t === 'cyan') applyTheme('#00ffff');
    else if (t === 'magenta') applyTheme('#ff00ff');
    else applyTheme('#00ff66');
  });
});

/* =========================
   PORTAL SYSTEM (HARD LOCK)
========================= */
const portal = document.getElementById('portal-overlay');
const portalText = document.getElementById('portal-text');

body.classList.add('locked');

const portalMessages = [
  'INITIALIZING',
  'DECRYPTING',
  'SYNCING SIGNAL',
  'ENTERING SYSTEM'
];

let portalIndex = 0;
let portalInterval = setInterval(() => {
  if (portalText) {
    portalText.textContent = portalMessages[portalIndex];
    portalIndex = (portalIndex + 1) % portalMessages.length;
  }
}, 700);

function exitPortal() {
  clearInterval(portalInterval);

  if (portal) {
    portal.style.transition = 'transform 0.7s ease, opacity 0.7s ease';
    portal.style.transform = 'scale(6)';
    portal.style.opacity = '0';
  }

  setTimeout(() => {
    if (portal) portal.remove();
    body.classList.remove('locked');
  }, 700);
}

document.addEventListener(
  'pointerdown',
  exitPortal,
  { once: true }
);

/* =========================
   FALLBACK SAFETY
========================= */
setTimeout(() => {
  if (document.body.classList.contains('locked')) {
    if (portal) portal.remove();
    body.classList.remove('locked');
  }
}, 6000);