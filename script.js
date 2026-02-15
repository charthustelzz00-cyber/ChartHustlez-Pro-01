console.log("Phase 4: Caution tape motion active");

/* =========================
   THEME HANDLING
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
reduceMotionToggle.addEventListener('change', () => {
  document.body.classList.toggle('reduce-motion', reduceMotionToggle.checked);
});

/* =========================
   MATRIX
========================= */
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

let width, height, columns, drops;
const fontSize = 16;
const chars = '0123456789#$%&@ΞΩλΔ';

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  columns = Math.floor(width / fontSize);
  drops = Array(columns).fill(0);
}
resize();
window.addEventListener('resize', resize);

let visible = true;
setInterval(() => visible = !visible, 3500);

function drawMatrix() {
  if (reduceMotionToggle.checked) return;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.fillRect(0, 0, width, height);

  if (!visible) return;

  ctx.fillStyle = currentColor;
  ctx.font = `${fontSize}px 'Share Tech Mono'`;

  drops.forEach((y, i) => {
    const text = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(text, i * fontSize, y * fontSize);
    drops[i] = y * fontSize > height && Math.random() > 0.975 ? 0 : y + 1;
  });
}

setInterval(drawMatrix, 50);

/* =========================
   SNOW
========================= */
const snowLayer = document.getElementById('snow-layer');
const MAX_SNOW = 40;

function createSnowflake() {
  if (reduceMotionToggle.checked) return;

  const flake = document.createElement('div');
  flake.className = 'snowflake';

  const size = Math.random() * 2 + 2;
  flake.style.width = `${size}px`;
  flake.style.height = `${size}px`;
  flake.style.left = `${Math.random() * window.innerWidth}px`;

  snowLayer.appendChild(flake);

  flake.animate(
    [
      { transform: 'translate(0, 0)', opacity: 0.8 },
      { transform: `translate(${(Math.random() - 0.5) * 40}px, -${window.innerHeight}px)`, opacity: 0 }
    ],
    { duration: Math.random() * 4000 + 6000, easing: 'linear' }
  );

  setTimeout(() => flake.remove(), 8000);
}

setInterval(() => {
  if (snowLayer.children.length < MAX_SNOW) createSnowflake();
}, 400);

/* =========================
   CAUTION TAPE MOTION (JS)
========================= */
const tapeA = document.querySelector('.caution-a');
const tapeB = document.querySelector('.caution-b');

let tapeOffset = 0;
let tapeDir = 1;

function animateTapes() {
  if (!reduceMotionToggle.checked) {
    tapeOffset += tapeDir * 0.15;

    if (tapeOffset > 6 || tapeOffset < -6) {
      tapeDir *= -1;
    }

    tapeA.style.transform =
      `translate3d(-50%, ${tapeOffset}px, 0) rotate(-30deg)`;
    tapeB.style.transform =
      `translate3d(-50%, ${-tapeOffset}px, 0) rotate(150deg)`;
  }

  requestAnimationFrame(animateTapes);
}

animateTapes();