const MATRIX_CHARS = "01アイウエオカキクケコサシスセソタチツテト";

const CONFIG = {
  matrixCount: window.innerWidth < 768 ? 30 : 50,
  snowCount: window.innerWidth < 768 ? 40 : 60
};

function applyTemplateContent() {
  const cfg = window.SITE_CONFIG;
  if (!cfg) return;

  document.getElementById('hero-title').textContent = cfg.brand.name;
  document.getElementById('hero-tagline').textContent = cfg.brand.tagline;

  const cta = document.getElementById('cta-btn');
  cta.textContent = cfg.hero.ctaText;
  cta.onclick = () => window.location.href = cfg.hero.ctaLink;

  document.querySelectorAll('.marquee').forEach(m => {
    m.style.animationDuration = `${cfg.marquee.speed}s`;
  });
}

function initPortal() {
  const landing = document.getElementById('landing-page');
  const portal = document.getElementById('loading-portal');

  let progress = 0;
  const bar = document.getElementById('loading-bar');
  const text = document.getElementById('loading-text');

  const interval = setInterval(() => {
    progress += 2;
    bar.style.width = progress + "%";
    text.textContent = `Loading... ${progress}%`;

    if (progress >= 100) {
      clearInterval(interval);

      portal.classList.add('fade-out');

      setTimeout(() => {
        portal.remove();
        landing.classList.remove('hidden');
        landing.classList.add('travel-in');
      }, 900);
    }
  }, 50);
}

document.addEventListener('DOMContentLoaded', () => {
  applyTemplateContent();
  initPortal();
});