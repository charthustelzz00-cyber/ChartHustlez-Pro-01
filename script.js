/* ======================================================
   GLOBAL CONFIG
====================================================== */
const cfg = window.SITE_CONFIG || {};

/* ======================================================
   THEME SYSTEM (AUTOMATION)
====================================================== */
function setTheme(theme) {
  if (!cfg.themes || !cfg.themes[theme]) return;

  // Set theme attribute
  document.documentElement.setAttribute("data-theme", theme);

  // Update primary color variable dynamically
  document.documentElement.style.setProperty(
    "--primary",
    cfg.themes[theme]
  );

  // Update active button state
  document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.theme === theme);
  });
}

/* ======================================================
   CONTENT + SPEED AUTOMATION
====================================================== */
function applyAutomation() {
  // Hero content
  const heroTitle = document.getElementById("hero-title");
  const heroTagline = document.getElementById("hero-tagline");
  const ctaBtn = document.getElementById("cta-btn");

  if (heroTitle && cfg.brand?.name) {
    heroTitle.textContent = cfg.brand.name;
  }

  if (heroTagline && cfg.brand?.tagline) {
    heroTagline.textContent = cfg.brand.tagline;
  }

  if (ctaBtn && cfg.hero) {
    ctaBtn.textContent = cfg.hero.ctaText || "Join";
    ctaBtn.onclick = () => {
      if (cfg.hero.ctaLink) {
        window.location.href = cfg.hero.ctaLink;
      }
    };
  }

  // Marquee speed automation
  document.querySelectorAll(".marquee-track").forEach(track => {
    const speed =
      (cfg.speed?.marqueeSeconds || 30) *
      (cfg.speed?.globalMultiplier || 1);

    track.style.animationDuration = `${speed}s`;
  });

  // Pulse animation speed
  if (cfg.speed?.pulseSeconds) {
    document.documentElement.style.setProperty(
      "--pulse-speed",
      `${cfg.speed.pulseSeconds}s`
    );
  }
}

/* ======================================================
   PORTAL LOADER (FAILSAFE + TRAVEL EFFECT)
====================================================== */
function initPortal() {
  const portal = document.getElementById("loading-portal");
  const landing = document.getElementById("landing-page");
  const loadingText = document.getElementById("loading-text");

  if (!portal || !landing) return;

  let progress = 0;
  let exited = false;

  function exitPortal() {
    if (exited) return;
    exited = true;

    portal.classList.add("fade-out");

    setTimeout(() => {
      portal.remove();

      landing.classList.remove("hidden");

      // Apply travel strength from config
      landing.style.setProperty(
        "--travel-scale",
        cfg.speed?.portalTravelStrength || 1.5
      );

      landing.classList.add("travel-in");
    }, 600);
  }

  // Simulated loading progression
  const intervalTime =
    (cfg.speed?.portalLoadInterval || 40) *
    (cfg.speed?.globalMultiplier || 1);

  const interval = setInterval(() => {
    progress += 4;

    if (loadingText) {
      loadingText.textContent = `Loading… ${progress}%`;
    }

    if (progress >= 100) {
      clearInterval(interval);
      exitPortal();
    }
  }, intervalTime);

  // 🔒 HARD FAILSAFE -- never hang
  setTimeout(() => {
    clearInterval(interval);
    exitPortal();
  }, 2500);
}

/* ======================================================
   INIT (DOM READY)
====================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // Set default theme
  if (cfg.defaultTheme) {
    setTheme(cfg.defaultTheme);
  }

  // Apply all automation
  applyAutomation();

  // Start portal loader
  initPortal();

  // Theme button listeners
  document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      setTheme(btn.dataset.theme);
    });
  });
});