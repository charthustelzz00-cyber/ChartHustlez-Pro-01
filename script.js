/* THEME SWITCH */
function setTheme(theme) {
  document.body.setAttribute("data-theme", theme);
}

/* EMAIL SIGNUP (demo mode) */
function handleSignup(e) {
  e.preventDefault();
  document.getElementById("successMsg").textContent =
    "You're on the list. Launch incoming.";
}

/* SNOW */
const snowflakes = [];
for (let i = 0; i < 50; i++) {
  const snow = document.createElement("div");
  snow.className = "snowflake";
  snow.textContent = "❄";
  snow.style.left = Math.random() * window.innerWidth + "px";
  document.body.appendChild(snow);
  snowflakes.push({ el: snow, speed: Math.random() * 2 + 1 });
}

function animateSnow() {
  snowflakes.forEach(f => {
    let top = parseFloat(f.el.style.top || 0);
    top += f.speed;
    if (top > window.innerHeight) top = -10;
    f.el.style.top = top + "px";
  });
  requestAnimationFrame(animateSnow);
}
animateSnow();