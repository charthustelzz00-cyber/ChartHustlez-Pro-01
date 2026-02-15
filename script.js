/* ===== TOGGLES ===== */
const reduceMotionToggle = document.getElementById('reduceMotion');
const disableFXToggle = document.getElementById('disableFX');

/* ===== PORTAL ===== */
const portal = document.getElementById('portal-overlay');
const body = document.body;

const portalSeen = sessionStorage.getItem('portalSeen');

function exitPortal() {
  if (portalSeen || reduceMotionToggle.checked || disableFXToggle.checked) {
    portal.remove();
    body.classList.remove('locked');
    return;
  }

  sessionStorage.setItem('portalSeen', 'true');

  portal.classList.add('portal-exit');

  setTimeout(() => {
    portal.remove();
    body.classList.remove('locked');
  }, 700);
}

document.addEventListener('click', exitPortal, { once: true });

/* ===== CAUTION TEXT SCROLL ===== */
const tracks = document.querySelectorAll('.caution-track');
let scrollX = 0;

function scrollText() {
  if (!reduceMotionToggle.checked && !disableFXToggle.checked) {
    scrollX -= 0.35;
    tracks.forEach(t => t.style.transform = `translate3d(${scrollX}px,0,0)`);
    if (Math.abs(scrollX) > 400) scrollX = 0;
  }
  requestAnimationFrame(scrollText);
}
scrollText();