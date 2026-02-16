const cfg = window.SITE_CONFIG;

/* CONTENT */
function applyContent() {
  document.getElementById("hero-title").textContent = cfg.brand.name;
  document.getElementById("hero-tagline").textContent = cfg.brand.tagline;

  const cta = document.getElementById("cta-btn");
  cta.textContent = cfg.hero.ctaText;
  cta.onclick = () => location.href = cfg.hero.ctaLink;

  document.querySelectorAll(".marquee").forEach(m => {
    m.style.animationDuration =
      (cfg.speed.marqueeSeconds * cfg.speed.globalMultiplier) + "s";
  });
}

/* THEME */
document.querySelectorAll(".theme-btn").forEach(btn => {
  btn.onclick = () => {
    document.documentElement.setAttribute("data-theme", btn.dataset.theme);
    document.querySelectorAll(".theme-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  };
});

/* PORTAL */
function initPortal() {
  const portal = document.getElementById("loading-portal");
  const landing = document.getElementById("landing-page");
  const text = document.getElementById("loading-text");

  let progress = 0;
  let done = false;

  function exit() {
    if (done) return;
    done = true;
    portal.classList.add("fade-out");
    setTimeout(() => {
      portal.remove();
      landing.classList.remove("hidden");
      landing.style.setProperty("--travel-scale", cfg.speed.portalTravelStrength);
      landing.classList.add("travel-in");
    }, 600);
  }

  const interval = setInterval(() => {
    progress += 4;
    text.textContent = `Loading… ${progress}%`;
    if (progress >= 100) {
      clearInterval(interval);
      exit();
    }
  }, cfg.speed.portalLoadInterval);

  setTimeout(exit, 2500);
}

document.addEventListener("DOMContentLoaded", () => {
  applyContent();
  initPortal();
});