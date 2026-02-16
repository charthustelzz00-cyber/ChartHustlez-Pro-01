const cfg = window.SITE_CONFIG;

/* ===============================
   APPLY TEMPLATE CONTENT
================================ */
function applyTemplateContent() {
  document.getElementById("hero-title").textContent = cfg.brand.name;
  document.getElementById("hero-tagline").textContent = cfg.brand.tagline;

  const cta = document.getElementById("cta-btn");
  cta.textContent = cfg.hero.ctaText;
  cta.onclick = () => window.location.href = cfg.hero.ctaLink;

  // Apply marquee speed
  document.querySelectorAll(".marquee").forEach(m => {
    const duration = cfg.speed.marqueeSeconds * cfg.speed.globalMultiplier;
    m.style.animationDuration = `${duration}s`;
  });
}

/* ===============================
   PORTAL LOADING + TRAVEL
================================ */
function initPortal() {
  const portal = document.getElementById("loading-portal");
  const landing = document.getElementById("landing-page");
  const bar = document.getElementById("loading-bar");
  const text = document.getElementById("loading-text");

  let progress = 0;
  const intervalTime = cfg.speed.portalLoadInterval * cfg.speed.globalMultiplier;

  const interval = setInterval(() => {
    progress += 2;
    bar.style.width = progress + "%";
    text.textContent = `Loading... ${progress}%`;

    if (progress >= 100) {
      clearInterval(interval);

      portal.classList.add("fade-out");

      setTimeout(() => {
        portal.remove();
        landing.classList.remove("hidden");

        // Apply travel strength dynamically
        landing.style.setProperty(
          "--travel-scale",
          cfg.speed.portalTravelStrength
        );

        landing.classList.add("travel-in");
      }, 900);
    }
  }, intervalTime);
}

/* ===============================
   INIT
================================ */
document.addEventListener("DOMContentLoaded", () => {
  applyTemplateContent();
  initPortal();
});