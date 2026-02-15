console.log("Phase 2: Matrix initialized");

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
   MATRIX CANVAS
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

/* Pulse control */
let visible = true;
setInterval(() => visible = !visible, 3500);

/* Reduce motion */
const reduceMotionToggle = document.getElementById('reduceMotion');

function drawMatrix() {
  if (reduceMotionToggle.checked) return;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.fillRect(0, 0, width, height);

  if (!visible) return;

  ctx.fillStyle = currentColor;
  ctx.font = `${fontSize}px 'Share Tech Mono'`;

  drops.forEach((y, i) => {
    const text = chars[Math.floor(Math.random() * chars.length)];
    const x = i * fontSize;
    ctx.fillText(text, x, y * fontSize);

    if (y * fontSize > height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  });
}

setInterval(drawMatrix, 50);