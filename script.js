/* ===============================
   CHART HUSTLEZ MAIN SCRIPT
   =============================== */

const MATRIX_CHARS =
  "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン$%&@#*+=";

const CONFIG = {
  matrixCount: window.innerWidth < 768 ? 25 : 50,
  snowCount: window.innerWidth < 768 ? 30 : 60,
  portalDuration: 3000
};

/* ---------- PORTAL ---------- */
function initPortal() {
  const canvas = document.getElementById("portal-canvas");
  const ctx = canvas.getContext("2d");

  const loadingPortal = document.getElementById("loading-portal");
  const landingPage = document.getElementById("landing-page");
  const loadingBar = document.getElementById("loading-bar");
  const loadingText = document.getElementById("loading-text");
  const portalContent = document.getElementById("portal-content");
  const portalRing = document.getElementById("portal-ring");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const columns = Math.floor(canvas.width / 20);
  const drops = new Array(columns).fill(1);

  function drawMatrix() {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--primary");
    ctx.font = "15px monospace";

    drops.forEach((y, i) => {
      const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
      ctx.fillText(char, i * 20, y * 20);
      drops[i] = y * 20 > canvas.height && Math.random() > 0.975 ? 0 : y + 1;
    });
  }

  const matrixInterval = setInterval(drawMatrix, 35);

  setTimeout(() => portalContent.classList.add("visible"), 300);
  setTimeout(() => portalRing.classList.add("expanded"), 900);

  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += 2;
    loadingBar.style.width = progress + "%";
    loadingText.textContent = `Loading... ${progress}%`;
    if (progress >= 100) loadingText.textContent = "Entering...";
  }, 50);

  setTimeout(() => {
    clearInterval(matrixInterval);
    clearInterval(progressInterval);
    loadingPortal.classList.add("fade-out");

    setTimeout(() => {
      loadingPortal.remove();
      landingPage.classList.remove("hidden");
      initLandingPage();
    }, 1000);
  }, CONFIG.portalDuration);
}

/* ---------- LANDING ---------- */
function initLandingPage() {
  initMatrixRain();
  initSnowflakes();
  initThemeToggle();
  initCTA();
}

/* ---------- MATRIX ---------- */
function initMatrixRain() {
  const container = document.getElementById("matrix-rain");
  if (!container) return;

  const chars = [];

  for (let i = 0; i < CONFIG.matrixCount; i++) {
    const el = document.createElement("span");
    el.className = "matrix-char";
    el.textContent = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
    el.style.left = Math.random() * 100 + "%";
    el.style.top = Math.random() * -100 + "%";
    container.appendChild(el);
    chars.push({ el, y: Math.random() * -100, speed: Math.random() + 0.5 });
  }

  function animate() {
    chars.forEach(c => {
      c.y += c.speed;
      if (c.y > 110) c.y = -10;
      c.el.style.top = c.y + "%";
    });
    requestAnimationFrame(animate);
  }

  animate();
}

/* ---------- SNOW ---------- */
function initSnowflakes() {
  const container = document.getElementById("snowflakes");
  if (!container) return;

  for (let i = 0; i < CONFIG.snowCount; i++) {
    const flake = document.createElement("span");
    flake.className = "snowflake";
    flake.textContent = "❄";
    flake.style.left = Math.random() * 100 + "%";
    flake.style.bottom = Math.random() * -100 + "%";
    container.appendChild(flake);
  }
}

/* ---------- THEMES ---------- */
function initThemeToggle() {
  const buttons = document.querySelectorAll(".theme-btn");
  const saved = localStorage.getItem("charthustlez-theme") || "green";
  document.body.dataset.theme = saved;

  buttons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.theme === saved);
    btn.onclick = () => {
      document.body.dataset.theme = btn.dataset.theme;
      localStorage.setItem("charthustlez-theme", btn.dataset.theme);
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    };
  });
}

/* ---------- CTA ---------- */
function initCTA() {
  const btn = document.getElementById("cta-btn");
  if (!btn) return;

  btn.onclick = () => {
    alert("🚀 ChartHustlez launching soon!");
  };
}

/* ---------- START ---------- */
document.addEventListener("DOMContentLoaded", initPortal);