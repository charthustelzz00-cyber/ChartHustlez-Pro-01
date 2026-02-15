document.addEventListener('DOMContentLoaded', () => {

  const root = document.documentElement;
  const body = document.body;

  const portal = document.getElementById('portal-overlay');
  const portalText = document.getElementById('portal-text');
  const portalBar = document.querySelector('.portal-bar-fill');

  const reduceMotion = document.getElementById('reduceMotion');
  const disableFX = document.getElementById('disableFX');

  /* ===== THEME ===== */
  function applyTheme(color) {
    root.style.setProperty('--primary', color);
    localStorage.setItem('themeColor', color);
    if (portal) {
      portal.style.background =
        `radial-gradient(circle at center, ${color}, #020402 70%)`;
    }
  }

  applyTheme(localStorage.getItem('themeColor') || '#00ff66');

  document.querySelectorAll('[data-theme]').forEach(btn => {
    btn.onclick = () => {
      applyTheme(
        btn.dataset.theme === 'cyan' ? '#00ffff' :
        btn.dataset.theme === 'magenta' ? '#ff00ff' :
        '#00ff66'
      );
    };
  });

  /* ===== PORTAL ===== */
  const messages = ['INITIALIZING','DECRYPTING','SYNCING','ENTERING'];
  let i = 0;

  const msgTimer = setInterval(() => {
    if (portalText) portalText.textContent = messages[i++ % messages.length];
  }, 700);

  let progress = 0;
  const barTimer = setInterval(() => {
    progress += 8;
    if (portalBar) portalBar.style.width = progress + '%';
    if (progress >= 100) clearInterval(barTimer);
  }, 300);

  function cleanupPortal() {
    clearInterval(msgTimer);
    clearInterval(barTimer);
    portal.remove();
    body.classList.remove('locked');
    startFX();
  }

  document.addEventListener('pointerdown', () => {
    const sound = document.getElementById('glitchSound');
    sound && sound.play().catch(()=>{});
    portal.style.transform = 'scale(6)';
    portal.style.opacity = '0';
    setTimeout(cleanupPortal, 700);
  }, { once:true });

  setTimeout(cleanupPortal, 6000);

  /* ===== MATRIX ===== */
  const matrix = document.getElementById('matrix');
  const mtx = matrix.getContext('2d');
  const chars = '01∆#@$%&*';

  function resizeCanvas(c) {
    c.width = innerWidth;
    c.height = innerHeight;
  }

  let drops = [];

  function initMatrix() {
    resizeCanvas(matrix);
    drops = Array(Math.floor(matrix.width / 16)).fill(0);
  }

  function drawMatrix() {
    mtx.fillStyle = 'rgba(0,0,0,0.08)';
    mtx.fillRect(0,0,matrix.width,matrix.height);
    mtx.fillStyle = getComputedStyle(root).getPropertyValue('--primary');
    mtx.font = '14px monospace';

    drops.forEach((y,i)=>{
      const text = chars[Math.floor(Math.random()*chars.length)];
      mtx.fillText(text, i*16, y*16);
      drops[i] = y*16 > matrix.height && Math.random() > 0.975 ? 0 : y+1;
    });
  }

  /* ===== SNOW ===== */
  const snow = document.getElementById('snow');
  const sctx = snow.getContext('2d');
  let flakes = [];

  function initSnow() {
    resizeCanvas(snow);
    flakes = Array.from({length:80},()=>({
      x:Math.random()*snow.width,
      y:snow.height+Math.random()*snow.height,
      r:Math.random()*1.5+0.5,
      vx:(Math.random()-0.5)*0.3,
      vy:-Math.random()*0.6-0.3
    }));
  }

  function drawSnow() {
    sctx.clearRect(0,0,snow.width,snow.height);
    sctx.fillStyle = 'rgba(255,255,255,0.6)';
    flakes.forEach(f=>{
      f.x+=f.vx; f.y+=f.vy;
      if(f.y<0){f.y=snow.height;f.x=Math.random()*snow.width;}
      sctx.beginPath();
      sctx.arc(f.x,f.y,f.r,0,Math.PI*2);
      sctx.fill();
    });
  }

  /* ===== LOOP ===== */
  let last = 0;
  function loop(t){
    if(disableFX.checked || reduceMotion.checked) return;
    if(t-last>50){
      drawMatrix();
      drawSnow();
      last=t;
    }
    requestAnimationFrame(loop);
  }

  function startFX(){
    initMatrix();
    initSnow();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', ()=>{
    initMatrix();
    initSnow();
  });

});