/* =========================
   THEME
========================= */
const root = document.documentElement;
let currentColor = '#00ff66';

document.querySelectorAll('[data-theme]').forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset.theme;
    if (theme === 'green') currentColor = '#00ff66';
    if (theme === 'cyan') currentColor = '#00ffff';
    if (theme === 'magenta') currentColor = '#ff00ff';
    root.style.setProperty('--primary', currentColor);
  });
});

/* =========================
   REDUCE MOTION
========================= */
const reduceMotionToggle = document.getElementById('reduceMotion');

/* =========================
   MATRIX (DIMMED)
========================= */
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const chars = '0123456789#$%&@ΞΩλΔ';
const fontSize = 16;
let columns = Math.floor(canvas.width / fontSize);
let drops = Array(columns).fill(0);

function drawMatrix() {
  if (reduceMotionToggle.checked) return;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = currentColor;
  ctx.font = `${fontSize}px monospace`;

  drops.forEach((y, i) => {
    const text = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(text, i * fontSize, y * fontSize);
    drops[i] = y * fontSize > canvas.height && Math.random() > 0.98 ? 0 : y + 1;
  });
}
setInterval(drawMatrix, 60);

/* =========================
   SNOW (VISIBLE)
========================= */
const snowLayer = document.getElementById('snow-layer');

setInterval(() => {
  if (reduceMotionToggle.checked) return;

  const flake = document.createElement('div');
  flake.style.position = 'absolute';
  flake.style.bottom = '-10px';
  flake.style.left = `${Math.random() * window.innerWidth}px`;
  flake.style.width = '4px';
  flake.style.height = '4px';
  flake.style.borderRadius = '50%';
  flake.style.background = currentColor;
  snowLayer.appendChild(flake);

  flake.animate(
    [
      { transform: 'translateY(0)', opacity: 0.8 },
      { transform: `translateY(-${window.innerHeight}px)`, opacity: 0 }
    ],
    { duration: 7000, easing: 'linear' }
  );

  setTimeout(() => flake.remove(), 7000);
}, 500);

/* =========================
   GLITCH (FORCED)
========================= */
const glitchOverlay = document.getElementById('glitch-overlay');
const glitchSound = document.getElementById('glitchSound');

function triggerGlitch() {
  if (reduceMotionToggle.checked) return;

  glitchOverlay.style.opacity = '1';
  glitchOverlay.animate(
    [
      { transform: 'translate(0,0)', opacity: 0.9 },
      { transform: 'translate(-8px,4px)', opacity: 0.6 },
      { transform: 'translate(8px,-4px)', opacity: 0.8 },
      { transform: 'translate(0,0)', opacity: 0 }
    ],
    { duration: 500, easing: 'steps(2,end)' }
  );

  glitchSound.currentTime = 0;
  glitchSound.play().catch(() => {});
}

document.addEventListener('click', triggerGlitch, { once: true });

/* =========================
   CAUTION BILLBOARD SCROLL
========================= */
const tracks = document.querySelectorAll('.caution-track');

let scrollX = 0;

function scrollCautionText() {
  if (!reduceMotionToggle.checked) {
    scrollX -= 0.35;

    tracks.forEach(track => {
      track.style.transform = `translate3d(${scrollX}px, 0, 0)`;
    });

    if (Math.abs(scrollX) > 400) {
      scrollX = 0;
    }
  }

  requestAnimationFrame(scrollCautionText);
}

scrollCautionText();