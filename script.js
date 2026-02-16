const cfg = window.SITE_CONFIG || {};

/* ===============================
   APPLY TEMPLATE CONTENT
================================ */
function applyTemplateContent() {
  if (!cfg.brand) return;

  document.getElementById("hero-title").textContent = cfg.brand.name;
  document.getElementById("hero-tagline").textContent = cfg.brand.tagline;

  const cta = document.getElementById("cta-btn");
  cta.textContent = cfg.hero.ctaText;
  cta.onclick = () => window.location.href = cfg.hero.ctaLink;

  // Apply marquee speed safely
  document.querySelectorAll(".marquee").forEach(m => {
    const duration = (cfg.speed?.marqueeSeconds || 30) *
                     (cfg.speed?.globalMultiplier || 1);
    m.style.animationDuration = `${duration}s`;
  });
}

/* ===============================
   SAFE PORTAL EXIT (FIXED)
================================ */
function initPortal() {
  const portal = document.getElementById("loading-portal");
  const landing = document.getElementById("landing-page");
  const bar = document.getElementById("loading-bar");
  const text = document.getElementById("loading-text");

  let progress = 0;
  let exited = false;

  const intervalTime =
    (cfg.speed?.portalLoadInterval || 40) *
    (cfg.speed?.globalMultiplier || 1);

  function exitPortal() {
    if (exited) return;
    exited = true;

    portal.classList.add("fade-out");

    setTimeout(() => {
      portal.remove();
      landing.classList.remove("hidden");

      landing.style.setProperty(
        "--travel-scale",
        cfg.speed?.portalTravelStrength || 1.6
      );

      landing.classList.add("travel-in");
    }, 600);
  }

  /* NORMAL LOADING */
  const interval = setInterval(() => {
    progress += 2;

    if (bar) bar.style.width = progress + "%";
    if (text) text.textContent = `Loading... ${progress}%`;

    if (progress >= 100) {
      clearInterval(interval);
      exitPortal();
    }
  }, intervalTime);

  /* 🔥 FAILSAFE (CRITICAL FIX) */
  setTimeout(() => {
    clearInterval(interval);
    exitPortal();
  }, 3000); // NEVER wait more than 3s
}

/* ===============================
   INIT
================================ */
document.addEventListener("DOMContentLoaded", () => {
  applyTemplateContent();
  initPortal();
});