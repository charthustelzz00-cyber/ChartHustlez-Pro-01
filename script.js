document.addEventListener('DOMContentLoaded', () => {

  const root = document.documentElement;
  const portal = document.getElementById('portal');
  const portalText = document.getElementById('portal-text');
  const bar = document.querySelector('.portal-bar-fill');

  const reduceMotion = document.getElementById('reduceMotion');
  const disableFX = document.getElementById('disableFX');

  let fxEnabled = false;

  /* ===== THEME ===== */
  document.querySelectorAll('[data-theme]').forEach(btn => {
    btn.onclick = () => {
      root.style.setProperty('--primary', btn.dataset.theme);
      localStorage.setItem('theme', btn.dataset.theme);
    };
  });

  const saved = localStorage.getItem('theme');
  if (saved) root.style.setProperty('--primary', saved);

  /* ===== PORTAL ===== */
  const msgs = ['INITIALIZING', 'SYNCING', 'DECRYPTING', 'ENTERING'];
  let i = 0;
  const msgLoop = setInterval(() => {
    portalText.textContent = msgs[i++ % msgs.length];
  }, 700);

  let progress = 0;
  const barLoop = setInterval(() => {
    progress += 5;
    bar.style.width = progress + '%';
    if (progress >= 100) clearInterval(barLoop);
  }, 320);

  function exitPortal() {
    clearInterval(msgLoop);
    portal.style.transform = 'scale(6)';
    portal.style.opacity = '0';
    setTimeout(() => {
      portal.remove();
      document.body.classList.remove('locked');
      fxEnabled = true;
    }, 700);
  }

  document.addEventListener('pointerdown', exitPortal, { once: true });
  setTimeout(exitPortal, 6000);

  /* ===== MATRIX ===== */
  const canvas = document.getElementById('matrix');
  const ctx = canvas.getContext('2d');
  const chars = '01∆#@$%';
  let drops = [];

  function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    drops = Array(Math.floor(canvas.width / 26)).fill(0);
  }
  resize();
  window.addEventListener('resize', resize);

  let last = 0;
  function draw(t) {
    if (!fxEnabled || disableFX.checked) return requestAnimationFrame(draw);

    const speed = reduceMotion.checked ? 160 : 95;
    if (t - last > speed) {
      ctx.fillStyle = 'rgba(0,0,0,0.14)';
      ctx.fillRect(0,0,canvas.width,canvas.height);

      ctx.fillStyle = getComputedStyle(root).getPropertyValue('--primary');
      ctx.font = '12px monospace';

      drops.forEach((y,i)=>{
        ctx.fillText(chars[Math.random()*chars.length|0], i*26, y*26);
        drops[i] = y*26 > canvas.height && Math.random() > 0.985 ? 0 : y+1;
      });

      last = t;
    }
    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
});