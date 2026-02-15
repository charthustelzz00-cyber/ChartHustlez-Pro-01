const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

const chars = '01#$%&∆';
let drops = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drops = Array(Math.floor(canvas.width / 26)).fill(0);
}
resize();
window.addEventListener('resize', resize);

function draw() {
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = getComputedStyle(document.documentElement)
    .getPropertyValue('--primary');
  ctx.font = '12px monospace';

  drops.forEach((y, i) => {
    const char = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(char, i * 26, y * 26);
    drops[i] = y * 26 > canvas.height && Math.random() > 0.97 ? 0 : y + 1;
  });

  requestAnimationFrame(draw);
}

draw();