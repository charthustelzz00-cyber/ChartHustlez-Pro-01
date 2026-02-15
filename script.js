/* THEME SWITCH */
function setTheme(theme) {
  document.body.setAttribute("data-theme", theme);

  const fx = FX_BY_THEME[theme];
  matrixCanvas.style.display = fx.matrix ? "block" : "none";

  snowflakes.forEach(f =>
    f.el.style.display = fx.snow ? "block" : "none"
  );
}

/* EMAIL SIGNUP */
function handleSignup(e) {
  e.preventDefault();
  document.getElementById("successMsg").textContent =
    "You're on the list. Launch incoming.";
}

/* ACCESSIBILITY */
let reduceMotion = false;
const reduceToggle = document.getElementById("reduceMotionToggle");

if (reduceToggle) {
  reduceToggle.addEventListener("change", e => {
    reduceMotion = e.target.checked;
  });
}

/* FX PER THEME */
const FX_BY_THEME = {
  green: { matrix: true, snow: true },
  cyan: { matrix: true, snow: false },
  magenta: { matrix: false, snow: true }
};

/* SNOW + WIND */
const isMobile = window.innerWidth < 768;
const SNOW_COUNT = isMobile ? 20 : 50;
const snowflakes = [];

let wind = 0;
let windTarget = 0;

setInterval(() => {
  windTarget = Math.random() * 1.5 - 0.75;
}, 4000);

for (let i = 0; i < SNOW_COUNT; i++) {
  const snow = document.createElement("div");
  snow.className = "snowflake";
  snow.textContent = "❄";
  snow.style.left = Math.random() * window.innerWidth + "px";
  snow.style.bottom = Math.random() * window.innerHeight + "px";
  document.body.appendChild(snow);

  snowflakes.push({
    el: snow,
    speed: Math.random() * 0.6 + 0.3
  });
}

function animateSnow() {
  if (!reduceMotion) {
    wind += (windTarget - wind) * 0.02;

    snowflakes.forEach(f => {
      let bottom = parseFloat(f.el.style.bottom);
      bottom += f.speed;

      f.el.style.left =
        parseFloat(f.el.style.left) + wind * 0.3 + "px";

      if (bottom > window.innerHeight + 20) bottom = -10;
      f.el.style.bottom = bottom + "px";
    });
  }
  requestAnimationFrame(animateSnow);
}
animateSnow();

/* CANVAS MATRIX */
const matrixCanvas = document.getElementById("matrixCanvas");
const ctx = matrixCanvas.getContext("2d");

function resizeCanvas() {
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const fontSize = isMobile ? 14 : 16;
const columns = Math.floor(matrixCanvas.width / fontSize);
const drops = Array(columns).fill(0);
const matrixChars = "01$#@%&*+=<>?/";

function drawMatrix() {
  if (reduceMotion) return;

  ctx.fillStyle = "rgba(0,0,0,0.08)";
  ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

  const primary =
    getComputedStyle(document.body)
      .getPropertyValue("--primary")
      .trim() || "#00ff00";

  ctx.fillStyle = primary;
  ctx.font = fontSize + "px monospace";

  drops.forEach((y, i) => {
    const char =
      matrixChars[Math.floor(Math.random() * matrixChars.length)];
    ctx.fillText(char, i * fontSize, y * fontSize);

    if (y * fontSize > matrixCanvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  });
}

setInterval(drawMatrix, isMobile ? 70 : 40);

/* PORTAL GLITCH + SOUND */
const glitchSound = document.getElementById("glitchSound");
let portalTriggered = false;

document.addEventListener("click", () => {
  if (portalTriggered || reduceMotion) return;
  portalTriggered = true;

  document.body.classList.add("portal-glitch");

  if (glitchSound) {
    glitchSound.currentTime = 0;
    glitchSound.play().catch(() => {});
  }

  setTimeout(() => {
    document.body.classList.remove("portal-glitch");
  }, 600);
});

/* PRELOADER EXIT */
window.addEventListener("load", () => {
  setTimeout(() => {
    const preloader = document.getElementById("preloader");
    if (!preloader) return;
    preloader.style.opacity = "0";
    preloader.style.transition = "opacity 0.8s";
    setTimeout(() => preloader.remove(), 800);
  }, 1200);
});