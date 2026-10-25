/* =========================================================
   CONFIG — edit these for each customer
   Put these files in the same folder as index.html:
     background.jpg   (full-screen background)
     gallery.jpg      (the one gallery photo)
     audio.mp3        (the music)
   ========================================================= */
const CONFIG = {
  name: "DD",
  tagline: "Legend on the pitch. Hero off it.",
  galleryCaption: "Stay smiling My Son",

  messageTitle: "This one's for you MF!",
  messageParagraphs: [
    "Our play boy is played by a women of his dreams  if you ever feel depressed then just mastarbate yourself with some lotion and cream . Happy birthday jaw titan ✨"
  ],
  signoff: "Happy Birthday Son!",
  sender: "~Shoaib the Goat",

  assets: {
    background: "background.jpg",
    gallery: "gallery.jpg",
    audio: "audio.mp3"
  },
  volume: 0.85
};

/* =========================================================
   Helpers
   ========================================================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rand = (a, b) => a + Math.random() * (b - a);
const TAU = Math.PI * 2;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const sleep = ms => new Promise(r => setTimeout(r, reduceMotion ? 0 : ms));
const root = document.documentElement;

function buzz(p) {
  if (navigator.vibrate && navigator.userActivation && navigator.userActivation.hasBeenActive) {
    try { navigator.vibrate(p); } catch (e) { /* ignore */ }
  }
}

/* =========================================================
   Content and images
   ========================================================= */
function splitWords(el) {
  const words = el.textContent.split(" ");
  el.textContent = "";
  let i = 0;
  words.forEach((w, wi) => {
    const ws = document.createElement("span");
    ws.className = "word";
    [...w].forEach(c => {
      const s = document.createElement("span");
      s.textContent = c;
      s.style.setProperty("--i", i++);
      ws.appendChild(s);
    });
    el.appendChild(ws);
    if (wi < words.length - 1) el.appendChild(document.createTextNode(" "));
  });
}

function loadImage(src, ok, fail) {
  const img = new Image();
  img.onload = () => ok(img);
  img.onerror = () => fail && fail();
  img.src = src;
}

function populate() {
  splitWords($("#hb"));
  $("#name").textContent = CONFIG.name;
  $("#tagline").textContent = CONFIG.tagline;
  $("#caption").textContent = CONFIG.galleryCaption;
  $("#msg-title").textContent = CONFIG.messageTitle;
  $("#msg-sign").textContent = `${CONFIG.signoff}\n${CONFIG.sender}`;

  const body = $("#msg-body");
  CONFIG.messageParagraphs.forEach(t => {
    const p = document.createElement("p");
    p.textContent = t;
    body.appendChild(p);
  });

  // ticker text, repeated so the loop is seamless
  const unit = `<span>★ HAPPY BIRTHDAY ★</span><span>${CONFIG.name.toUpperCase()}</span>`;
  $("#ticker").innerHTML = unit.repeat(16);

  // background and gallery photo, with graceful fallbacks if a file is missing
  loadImage(CONFIG.assets.background, () => {
    $("#bg").style.backgroundImage = `url("${CONFIG.assets.background}")`;
  });
  loadImage(CONFIG.assets.gallery, img => {
    const holder = $("#photo-inner");
    holder.innerHTML = "";
    img.alt = CONFIG.galleryCaption;
    holder.appendChild(img);
  });
}

/* spider-web corners, generated once and reused in all four corners */
function webSVG() {
  const spokes = [0, 18, 36, 54, 72, 90];
  const rings = [26, 50, 74, 98];
  const rad = a => a * Math.PI / 180;
  let d = "";
  spokes.forEach(a => {
    d += `M0 0L${(Math.cos(rad(a)) * 104).toFixed(1)} ${(Math.sin(rad(a)) * 104).toFixed(1)}`;
  });
  rings.forEach(r => {
    spokes.forEach((a, i) => {
      const x = Math.cos(rad(a)) * r, y = Math.sin(rad(a)) * r;
      if (i === 0) { d += `M${x.toFixed(1)} ${y.toFixed(1)}`; return; }
      const m = rad((spokes[i - 1] + a) / 2), c = r * 0.86;
      d += `Q${(Math.cos(m) * c).toFixed(1)} ${(Math.sin(m) * c).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
    });
  });
  return `<svg viewBox="-2 -2 108 108" aria-hidden="true"><path d="${d}"/></svg>`;
}
$$("[data-web]").forEach(el => { el.innerHTML = webSVG(); });

/* =========================================================
   Canvas: confetti and web ripples
   ========================================================= */
const cv = $("#fx");
const ctx = cv.getContext("2d");
let W = innerWidth, H = innerHeight;
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  cv.width = W * dpr; cv.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

const COLORS = ["#e5232d", "#1d3fa8", "#75aadb", "#ffffff", "#ffd23f", "#ff5a63"];
const confetti = [];
const MAX_CONFETTI = 480;
let rainOn = false;

function addPiece(x, y, vx, vy) {
  if (confetti.length >= MAX_CONFETTI) confetti.shift();
  confetti.push({
    x, y, vx, vy, ph: rand(0, TAU), rot: rand(0, TAU), vr: rand(-8, 8),
    w: rand(7, 14), h: rand(4, 9), c: COLORS[Math.floor(rand(0, COLORS.length))],
    shape: Math.random() < 0.15 ? "star" : Math.random() < 0.3 ? "circle" : "rect"
  });
}
function confettiBurst(x, y, n, angle, spread, speed = 700) {
  const count = reduceMotion ? Math.ceil(n * 0.3) : n;
  for (let i = 0; i < count; i++) {
    const a = angle + rand(-spread, spread), s = rand(speed * 0.4, speed);
    addPiece(x, y, Math.cos(a) * s, Math.sin(a) * s);
  }
}
function celebrate() {
  confettiBurst(0, H * 0.85, 90, -Math.PI / 3, 0.45);
  confettiBurst(W, H * 0.85, 90, -Math.PI * 2 / 3, 0.45);
  setTimeout(() => confettiBurst(W / 2, H * 0.95, 80, -Math.PI / 2, 0.6, 850), 350);
  setTimeout(() => {
    confettiBurst(0, H * 0.5, 60, -Math.PI / 4, 0.5);
    confettiBurst(W, H * 0.5, 60, -Math.PI * 3 / 4, 0.5);
  }, 800);
}

function drawStar(r) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5 - Math.PI / 2, rr = i % 2 ? r * 0.45 : r;
    ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
}
function drawConfetti(dt, t) {
  if (rainOn && !reduceMotion) {
    const n = Math.max(1, Math.round(70 * dt));
    for (let i = 0; i < n; i++) addPiece(rand(0, W), -12, rand(-40, 40), rand(120, 260));
  }
  for (let i = confetti.length - 1; i >= 0; i--) {
    const p = confetti[i];
    p.vy += 520 * dt;
    p.vx *= 1 - 0.8 * dt;
    p.vy *= 1 - 0.35 * dt;
    p.x += (p.vx + Math.sin(t * 4 + p.ph) * 40) * dt;
    p.y += p.vy * dt;
    p.rot += p.vr * dt;
    if (p.y > H + 30) { confetti.splice(i, 1); continue; }
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.scale(1, Math.cos(t * 6 + p.ph));
    ctx.fillStyle = p.c;
    if (p.shape === "rect") ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    else if (p.shape === "circle") { ctx.beginPath(); ctx.arc(0, 0, p.h * 0.7, 0, TAU); ctx.fill(); }
    else drawStar(p.w * 0.7);
    ctx.restore();
  }
}

/* web ripples: a spider-web shape that spreads out from every tap */
const ripples = [];
function addRipple(x, y) { ripples.push({ x, y, t: 0 }); }
function drawRipples(dt) {
  ctx.lineWidth = 1.6;
  ctx.lineCap = "round";
  for (let i = ripples.length - 1; i >= 0; i--) {
    const r = ripples[i];
    r.t += dt;
    if (r.t > 0.9) { ripples.splice(i, 1); continue; }
    const k = r.t / 0.9, L = 40 + 150 * (1 - Math.pow(1 - k, 3)), n = 10;
    ctx.strokeStyle = `rgba(255,255,255,${1 - k})`;
    ctx.beginPath();
    for (let s = 0; s < n; s++) {
      const a = (s / n) * TAU;
      ctx.moveTo(r.x, r.y);
      ctx.lineTo(r.x + Math.cos(a) * L, r.y + Math.sin(a) * L);
    }
    [0.35, 0.65, 1].forEach(f => {
      for (let s = 0; s <= n; s++) {
        const a = (s / n) * TAU, x = r.x + Math.cos(a) * L * f, y = r.y + Math.sin(a) * L * f;
        if (s === 0) ctx.moveTo(x, y);
        else {
          const m = ((s - 0.5) / n) * TAU, c = L * f * 0.88;
          ctx.quadraticCurveTo(r.x + Math.cos(m) * c, r.y + Math.sin(m) * c, x, y);
        }
      }
    });
    ctx.stroke();
  }
}

/* parallax from pointer or device tilt */
const par = { x: 0, y: 0, tx: 0, ty: 0 };
const tilt = { x: 0, y: 0 };
let pointerN = { x: 0, y: 0 };
window.addEventListener("pointermove", e => { pointerN = { x: e.clientX / W - 0.5, y: e.clientY / H - 0.5 }; });
window.addEventListener("deviceorientation", e => {
  if (e.gamma == null) return;
  tilt.x = Math.max(-0.5, Math.min(0.5, e.gamma / 60));
  tilt.y = Math.max(-0.5, Math.min(0.5, (e.beta - 45) / 60));
});

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  const t = now / 1000;
  ctx.clearRect(0, 0, W, H);
  drawConfetti(dt, t);
  drawRipples(dt);

  par.tx = pointerN.x + tilt.x;
  par.ty = pointerN.y + tilt.y;
  par.x += (par.tx - par.x) * Math.min(1, dt * 3);
  par.y += (par.ty - par.y) * Math.min(1, dt * 3);
  root.style.setProperty("--px", par.x.toFixed(3));
  root.style.setProperty("--py", par.y.toFixed(3));
  requestAnimationFrame(frame);
}

window.addEventListener("pointerdown", e => addRipple(e.clientX, e.clientY));

/* =========================================================
   POW burst and page transitions
   ========================================================= */
const POWS = ["POW!", "GOAL!", "GOAL!", "GOAL!", "ZAP!"];
function pow(x, y) {
  if (reduceMotion) return;
  const el = document.createElement("div");
  el.className = "pow";
  el.textContent = POWS[Math.floor(rand(0, POWS.length))];
  el.style.left = x + "px";
  el.style.top = y + "px";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 750);
}

let busy = false;
function go(id, after) {
  if (busy) return;
  busy = true;
  const wipe = $("#wipe");
  wipe.classList.remove("run");
  void wipe.offsetWidth;
  wipe.classList.add("run");
  setTimeout(() => {
    $$(".page").forEach(p => p.classList.toggle("active", p.id === id));
    const page = document.getElementById(id);
    if (page) page.scrollTop = 0;
    if (after) after();
  }, reduceMotion ? 0 : 420);
  setTimeout(() => { wipe.classList.remove("run"); busy = false; }, reduceMotion ? 50 : 1050);
}

/* =========================================================
   Audio
   ========================================================= */
const audio = $("#audio");
function playAudio() {
  audio.src = CONFIG.assets.audio;
  audio.currentTime = 0;
  audio.volume = 0;
  audio.play().then(() => {
    let v = 0;
    const id = setInterval(() => {
      v += 0.08;
      audio.volume = Math.min(CONFIG.volume, v);
      if (v >= CONFIG.volume) clearInterval(id);
    }, 80);
  }).catch(() => { /* file missing or blocked: stay silent */ });
}
function stopAudio() {
  audio.pause();
  try { audio.currentTime = 0; } catch (e) { /* ignore */ }
}

/* =========================================================
   Flow: front -> gallery (music + confetti) -> message -> start over
   ========================================================= */
let msgRun = 0;

$("#open-gallery").addEventListener("click", e => {
  buzz(25);
  pow(e.clientX, e.clientY);
  playAudio();
  go("gallery", () => {
    celebrate();
    rainOn = true;
  });
});

$("#stop-continue").addEventListener("click", e => {
  buzz(15);
  pow(e.clientX, e.clientY);
  stopAudio();
  rainOn = false;
  go("message", revealMessage);
});

$("#start-over").addEventListener("click", e => {
  buzz(15);
  pow(e.clientX, e.clientY);
  msgRun++;
  stopAudio();
  rainOn = false;
  confetti.length = 0;
  go("front", resetMessage);
});

async function revealMessage() {
  const run = ++msgRun;
  await sleep(1100);
  for (const p of $$("#msg-body p")) {
    if (run !== msgRun) return;
    p.classList.add("show");
    await sleep(500);
  }
  if (run !== msgRun) return;
  $("#msg-sign").classList.add("show");
  confettiBurst(W / 2, H * 0.4, 50, -Math.PI / 2, 1.2, 600);
}
function resetMessage() {
  $$("#msg-body p, #msg-sign").forEach(p => p.classList.remove("show"));
  const btn = $("#open-gallery");
  btn.classList.remove("ready");
  btn.style.animation = "none";
  void btn.offsetWidth;
  btn.style.animation = "";
}

/* make the open button pulse once its intro animation has finished */
setTimeout(() => $("#open-gallery").classList.add("ready"), reduceMotion ? 0 : 2700);

/* =========================================================
   Init
   ========================================================= */
populate();
resize();
window.addEventListener("resize", resize);
requestAnimationFrame(frame);
