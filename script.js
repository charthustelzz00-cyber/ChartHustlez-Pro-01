/* ===== LOADER ===== */
window.addEventListener("load",()=>{
  setTimeout(()=>{
    document.getElementById("loader")
      .classList.add("fade-out");
  },1500);
});

/* ===== THEME SWITCH ===== */
function setTheme(theme){
  document.body.setAttribute("data-theme",theme);
}

/* ===== SIGNUP DEMO ===== */
function handleSignup(e){
  e.preventDefault();
  document.getElementById("successMsg")
    .textContent="You're on the list.";
}

/* =====================================================
   RISING ENERGY PARTICLES (BOTTOM → UP)
===================================================== */

const snowflakes=[];

for(let i=0;i<50;i++){
  const snow=document.createElement("div");
  snow.className="snowflake";
  snow.textContent="❄";

  snow.style.left=Math.random()*window.innerWidth+"px";
  snow.style.top=window.innerHeight+"px";

  document.body.appendChild(snow);

  snowflakes.push({
    el:snow,
    speed:Math.random()*1.5+.3
  });
}

function animateSnow(){
  snowflakes.forEach(f=>{
    let top=parseFloat(f.el.style.top);
    top-=f.speed;

    if(top<-20){
      top=window.innerHeight+20;
      f.el.style.left=Math.random()*window.innerWidth+"px";
    }

    f.el.style.top=top+"px";
  });

  requestAnimationFrame(animateSnow);
}
animateSnow();

/* =====================================================
   MATRIX RAIN
===================================================== */

const matrix=document.getElementById("matrix");
const mtx=matrix.getContext("2d");

function resizeMatrix(){
  matrix.width=innerWidth;
  matrix.height=innerHeight;
}
resizeMatrix();

const chars="01アイウエオABCDEFGHIJKLMNOPQRSTUVWXYZ";
const fontSize=16;
let columns;
let drops;

function initMatrix(){
  columns=Math.floor(matrix.width/fontSize);
  drops=Array(columns).fill(1);
}
initMatrix();

function drawMatrix(){
  mtx.fillStyle="rgba(0,0,0,0.08)";
  mtx.fillRect(0,0,matrix.width,matrix.height);

  mtx.fillStyle="#0f0";
  mtx.font=fontSize+"px monospace";

  drops.forEach((y,i)=>{
    const text=chars[Math.floor(Math.random()*chars.length)];
    mtx.fillText(text,i*fontSize,y*fontSize);

    if(y*fontSize>matrix.height && Math.random()>0.975){
      drops[i]=0;
    }
    drops[i]++;
  });

  requestAnimationFrame(drawMatrix);
}
drawMatrix();

/* =====================================================
   GPU SMOOTH GLOW PARTICLES
===================================================== */

const glowCanvas=document.getElementById("glowParticles");
const gtx=glowCanvas.getContext("2d");

function resizeGlow(){
  glowCanvas.width=innerWidth;
  glowCanvas.height=innerHeight;
}
resizeGlow();

const particles=[];
for(let i=0;i<60;i++){
  particles.push({
    x:Math.random()*innerWidth,
    y:Math.random()*innerHeight,
    vx:(Math.random()-.5)*0.3,
    vy:(Math.random()-.5)*0.3,
    size:Math.random()*2+1
  });
}

function animateGlow(){
  gtx.clearRect(0,0,glowCanvas.width,glowCanvas.height);

  particles.forEach(p=>{
    p.x+=p.vx;
    p.y+=p.vy;

    if(p.x<0||p.x>innerWidth)p.vx*=-1;
    if(p.y<0||p.y>innerHeight)p.vy*=-1;

    const grad=gtx.createRadialGradient(
      p.x,p.y,0,
      p.x,p.y,p.size*8
    );

    grad.addColorStop(0,"rgba(0,255,255,0.25)");
    grad.addColorStop(1,"transparent");

    gtx.fillStyle=grad;
    gtx.beginPath();
    gtx.arc(p.x,p.y,p.size*8,0,Math.PI*2);
    gtx.fill();
  });

  requestAnimationFrame(animateGlow);
}
animateGlow();

/* ===== RESIZE ===== */
window.addEventListener("resize",()=>{
  resizeMatrix();
  initMatrix();
  resizeGlow();
});
