document.addEventListener('DOMContentLoaded', () => {

  /* =========================
     CORE REFERENCES
  ========================= */
  const body = document.body;
  const root = document.documentElement;

  const portal = document.getElementById('portal-overlay');
  const portalText = document.getElementById('portal-text');
  const portalBar = document.querySelector('.portal-bar-fill');

  const reduceMotionToggle = document.getElementById('reduceMotion');
  const disableFXToggle = document.getElementById('disableFX');

  /* =========================
     THEME SYSTEM
  ========================= */
  let currentColor = '#00ff66';

  function applyTheme(color) {
    currentColor = color;
    root.style.setProperty('--primary', currentColor);
    localStorage.setItem('themeColor', currentColor);

    if (portal) {
      portal.style.background =
        `radial-gradient(circle at center, ${currentColor}, #020402 70%)`;
    }
  }

  const savedTheme = localStorage.getItem('themeColor');
  if (savedTheme) applyTheme(savedTheme);

  document.querySelectorAll('[data-theme]').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = btn.dataset.theme;
      if (t === 'cyan') applyTheme('#00ffff');
      else if (t === 'magenta') applyTheme('#ff00ff');
      else applyTheme('#00ff66');
    });
  });

  /* =========================
     PORTAL SYSTEM
  ========================= */

  body.classList.add('locked');

  if (portal) {
    portal.style.display = 'flex';
    portal.style.opacity = '1';
    portal.style.transform = 'scale(1)';
  }

  const portalMessages = [
    'INITIALIZING',
    'DECRYPTING',
    'SYNCING SIGNAL',
    'ENTERING SYSTEM'
  ];

  let portalIndex = 0;
  const portalInterval = setInterval(() => {
    if (portalText) {
      portalText.textContent = portalMessages[portalIndex];
      portalIndex = (portalIndex + 1) % portalMessages.length;
    }
  }, 700);

  let progress = 0;
  const progressTimer = setInterval(() => {
    progress += 8;
    if (portalBar) portalBar.style.width = progress + '%';
    if (progress >= 100) clearInterval(progressTimer);
  }, 300);

  function cleanupPortal() {
    clearInterval(portalInterval);
    clearInterval(progressTimer);
    if (portal) portal.remove();
    body.classList.remove('locked');
  }

  function exitPortal() {
    const glitchSound = document.getElementById('glitchSound');
    if (glitchSound) {
      glitchSound.volume = 0.4;
      glitchSound.currentTime = 0;
      glitchSound.play().catch(() => {});
    }

    if (
      (reduceMotionToggle && reduceMotionToggle.checked) ||
      (disableFXToggle && disableFXToggle.checked)
    ) {
      cleanupPortal();
      return;
    }

    if (portal) {
      portal.style.transition = 'transform 0.7s ease, opacity 0.7s ease';
      portal.style.transform = 'scale(6)';
      portal.style.opacity = '0';
    }

    setTimeout(cleanupPortal, 700);
  }

  setTimeout(() => {
    document.addEventListener('pointerdown', exitPortal, { once: true });
  }, 100);

  setTimeout(() => {
    if (body.classList.contains('locked')) {
      cleanupPortal();
    }
  }, 6000);

});