/* ========== SIGNUP PAGE SCRIPT ========== */

const MATRIX_CHARS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン$%&@#*+=<>{}[]|^~";

// Mini matrix rain for signup background
function initSignupMatrix() {
  const canvas = document.getElementById('signup-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const fontSize = 14;
  let columns = Math.floor(canvas.width / fontSize);
  let drops = Array(columns).fill(0).map(() => Math.random() * -50);

  window.addEventListener('resize', () => {
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(0).map(() => Math.random() * -50);
  });

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const color = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#00ff00';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText(char, x, y);

      ctx.fillStyle = color;
      ctx.globalAlpha = 0.4;
      ctx.fillText(char, x, y - fontSize);
      ctx.globalAlpha = 1;

      if (y > canvas.height && Math.random() > 0.98) {
        drops[i] = Math.random() * -10;
      }
      drops[i] += 0.3 + Math.random() * 0.3;
    }

    requestAnimationFrame(draw);
  }

  draw();
}

// Form submission
document.getElementById('signup-form').addEventListener('submit', e => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!name || !email) {
    alert("Please complete all fields.");
    return;
  }

  console.log("Signup:", { name, email });
  alert("Welcome to ChartHustlez!");
  e.target.reset();
});

// Initialize
document.addEventListener('DOMContentLoaded', initSignupMatrix);
