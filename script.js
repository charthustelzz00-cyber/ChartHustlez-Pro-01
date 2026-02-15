/* ================= PORTAL ================= */
const portal = document.getElementById('portal');
const portalText = document.getElementById('portalText');
const portalBar = document.getElementById('portalBar');
const body = document.body;

const messages = ['INITIALIZING', 'SYNCING', 'DECRYPTING', 'ENTERING'];
let msgIndex = 0;
let progress = 0;

const msgInterval = setInterval(() => {
  portalText.textContent = messages[msgIndex++ % messages.length];
}, 700);

const barInterval = setInterval(() => {
  progress += 5;
  portalBar.style.width = progress + '%';
  if (progress >= 100) clearInterval(barInterval);
}, 300);

function exitPortal() {
  clearInterval(msgInterval);
  portal.style.opacity = '0';
  portal.style.transform = 'scale(1.4)';
  setTimeout(() => {
    portal.remove();
    body.classList.remove('locked');
  }, 600);
}

portal.addEventListener('click', exitPortal);
setTimeout(exitPortal, 6000);

/* ================= MATRIX ================= */
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
const chars = '01#$%∆@';
let drops = [];

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  drops = Array(Math.floor(canvas.width / 26)).fill(0);
}
resize();
addEventListener('resize', resize);

function draw() {
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = getComputedStyle(document.documentElement)
    .getPropertyValue('--primary');
  ctx.font = '12px monospace';

  drops.forEach((y, i) => {
    ctx.fillText(
      chars[Math.random() * chars.length | 0],
      i * 26,
      y * 26
    );
    drops[i] = y * 26 > canvas.height && Math.random() > 0.97 ? 0 : y + 1;
  });

  requestAnimationFrame(draw);
}
draw();