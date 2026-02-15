/* ===== THEME ===== */
const root = document.documentElement;
let currentColor = '#00ff66';

document.querySelectorAll('[data-theme]').forEach(btn => {
  btn.addEventListener('click', () => {
    const t = btn.dataset.theme;
    currentColor =
      t === 'cyan' ? '#00ffff' :
      t === 'magenta' ? '#ff00ff' :
      '#00ff66';

    root.style.setProperty('--primary', currentColor);
  });
});

/* ===== REDUCE MOTION ===== */
const reduceMotionToggle = document.getElementById('reduceMotion');

/* ===== MATRIX (DIMMED, SAFE) ===== */
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

setInterval(() => {
  if (reduceMotionToggle.checked) return;

  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = currentColor;
  ctx.font = `${fontSize}px monospace`;

  drops.forEach((y, i) => {
    ctx.fillText(chars[Math.random() * chars.length | 0], i * fontSize, y * fontSize);
    drops[i] = y * fontSize > canvas.height && Math.random() > 0.98 ? 0 : y + 1;
  });
}, 60);

/* ===== SNOW ===== */
const snowLayer = document.getElementById('snow-layer');

setInterval(() => {
  if (reduceMotionToggle.checked) return;

  const flake = document.createElement('div');
  flake.style.cssText = `
    position:absolute;
    bottom:-6px;
    left:${Math.random() * window.innerWidth}px;
    width:4px;
    height:4px;
    border-radius:50%;
    background:${currentColor};
  `;
  snowLayer.appendChild(flake);

  flake.animate(
    [{ transform:'translateY(0)', opacity:0.8 },
     { transform:`translateY(-${window.innerHeight}px)`, opacity:0 }],
    { duration:7000, easing:'linear' }
  );

  setTimeout(() => flake.remove(), 7000);
}, 500);

/* ===== CAUTION TEXT SCROLL ===== */
const tracks = document.querySelectorAll('.caution-track');
let scrollX = 0;

function scrollText() {
  if (!reduceMotionToggle.checked) {
    scrollX -= 0.35;
    tracks.forEach(t => t.style.transform = `translate3d(${scrollX}px,0,0)`);
    if (Math.abs(scrollX) > 400) scrollX = 0;
  }
  requestAnimationFrame(scrollText);
}
scrollText();

/* ===== GLITCH ===== */
const glitchOverlay = document.getElementById('glitch-overlay');
const glitchSound = document.getElementById('glitchSound');

document.addEventListener('click', () => {
  if (reduceMotionToggle.checked) return;

  glitchOverlay.animate(
    [
      { opacity: 0.9, transform:'translate(0,0)' },
      { opacity: 0.6, transform:'translate(-6px,3px)' },
      { opacity: 0, transform:'translate(0,0)' }
    ],
    { duration: 500, easing:'steps(2,end)' }
  );

  glitchSound.currentTime = 0;
  glitchSound.play().catch(()=>{});
},{ once:true });