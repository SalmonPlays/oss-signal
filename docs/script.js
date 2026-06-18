const realms = {
  moon: {
    kicker: "Public GitHub source",
    title: "Repo Page",
    description: "まずGitHub repoを開き、README、release、issues、pull requests、security docs、workflow examplesへ流します。Evidenceとtrialの導線をここで強く出します。",
    image: "url('./assets/terminal-report.svg')",
    alt: "oss-signal terminal report preview",
    list: ["Repository source", "Issues and pull requests", "Evidence / trial / feedback"]
  },
  mist: {
    kicker: "Marketplace workflow",
    title: "Action Run",
    description: "GitHub Marketplaceからno-fail workflowを貼り、Actions上でstep summary、report、adoption artifactを生成します。試用結果はGitHub内で共有できます。",
    image: "url('./assets/github-step-summary.svg')",
    alt: "oss-signal GitHub Actions step summary preview",
    list: ["GitHub Marketplace", "Actions step summary", "Workflow artifact"]
  },
  ember: {
    kicker: "Issues, PRs, and reviewer proof",
    title: "Evidence Review",
    description: "reviewer evidence、trust center、Actions、Issues、Pull requestsを辿り、GitHub上に残る検証と外部反応をまとめて見せます。",
    image: "url('./assets/code-scanning-results.svg')",
    alt: "oss-signal code scanning SARIF preview",
    list: ["Reviewer evidence", "Issues and PRs", "Actions evidence"]
  }
};

const tickets = {
  wanderer: { name: "Evidence", channel: "review", vector: "Reviewer packet" },
  oracle: { name: "Action Run", channel: "workflow", vector: "Actions" },
  solstice: { name: "Issue / PR", channel: "feedback", vector: "Contribute" }
};

const state = {
  realm: "moon",
  ticket: "oracle",
  glow: 5
};

const ambientCanvasEnabled = false;
const canvas = document.querySelector("[data-star-canvas]");
const ctx = ambientCanvasEnabled && canvas ? canvas.getContext("2d") : null;
const cursorLight = document.querySelector("[data-cursor-light]");
const alienLayer = document.querySelector(".alien-layer");
const nav = document.querySelector("[data-site-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const soundToggle = document.querySelector("[data-sound-toggle]");
const beastTriggers = document.querySelectorAll("[data-beast-trigger]");
const celestialBeast = document.querySelector(".celestial-beast");
const realmTabs = document.querySelectorAll("[data-realm]");
const realmImage = document.querySelector("[data-realm-image]");
const realmKicker = document.querySelector("[data-realm-kicker]");
const realmTitle = document.querySelector("[data-realm-title]");
const realmDescription = document.querySelector("[data-realm-description]");
const realmList = document.querySelector("[data-realm-list]");
const ticketButtons = document.querySelectorAll("[data-ticket]");
const plannerForm = document.querySelector("[data-planner-form]");
const summaryPanel = document.querySelector("[data-summary-panel]");
const glowRange = document.querySelector("[data-glow-range]");
const entryStatus = document.querySelector("[data-entry-status]");
const gateTicket = document.querySelector("[data-gate-ticket]");
const gatePhase = document.querySelector("[data-gate-phase]");
const gateGlow = document.querySelector("[data-gate-glow]");
const ascensionTitle = document.querySelector("[data-ascension-title]");
const ascensionCopy = document.querySelector("[data-ascension-copy]");
const apexGate = document.querySelector("[data-apex-gate]");
const apexAltitude = document.querySelector("[data-apex-altitude]");
const apexResonance = document.querySelector("[data-apex-resonance]");
const apexVector = document.querySelector("[data-apex-vector]");
const skySeal = document.querySelector("[data-sky-seal]");
const skylineCurrent = document.querySelector("[data-skyline-current]");
const plannerBand = document.querySelector(".planner-band");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let stars = [];
let sparks = [];
let pointer = { x: 0.5, y: 0.4 };
let animationFrame;
let scrollBoost = 0;
let lastScrollY = window.scrollY;
let lastSparkTime = 0;
let pointerFrame;
let scrollFrame;
let beastInterval;
let beastRemoveTimer;
let beastCooldownTimer;
let beastCooldown = false;
let soundEnabled = false;
let soundContext;
let lastSoundTime = 0;

function getSoundContext() {
  if (!soundContext) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    soundContext = new AudioContext();
  }
  if (soundContext.state === "suspended") {
    soundContext.resume();
  }
  return soundContext;
}

function setSoundEnabled(enabled) {
  soundEnabled = enabled;
  if (!soundToggle) return;
  soundToggle.classList.toggle("is-on", soundEnabled);
  soundToggle.setAttribute("aria-label", soundEnabled ? "効果音をオフにする" : "効果音をオンにする");
  soundToggle.innerHTML = `<i data-lucide="${soundEnabled ? "volume-2" : "volume-x"}"></i>`;
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function playTone(ctx, { start = 0, frequency = 440, endFrequency = frequency, duration = 0.16, type = "sine", gain = 0.05 }) {
  const oscillator = ctx.createOscillator();
  const volume = ctx.createGain();
  const now = ctx.currentTime + start;
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), now + duration);
  volume.gain.setValueAtTime(0.0001, now);
  volume.gain.exponentialRampToValueAtTime(gain, now + 0.018);
  volume.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.connect(volume);
  volume.connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.025);
}

function playSfx(type = "tap") {
  if (!soundEnabled || reduceMotion) return;
  const now = performance.now();
  if (type === "hover" && now - lastSoundTime < 140) return;
  lastSoundTime = now;
  const ctx = getSoundContext();
  if (!ctx) return;
  const sounds = {
    hover: [
      { frequency: 520, endFrequency: 780, duration: 0.09, type: "sine", gain: 0.018 }
    ],
    tab: [
      { frequency: 392, endFrequency: 622, duration: 0.12, type: "triangle", gain: 0.032 },
      { start: 0.055, frequency: 622, endFrequency: 830, duration: 0.1, type: "sine", gain: 0.022 }
    ],
    launch: [
      { frequency: 130, endFrequency: 64, duration: 0.18, type: "sawtooth", gain: 0.036 },
      { start: 0.045, frequency: 740, endFrequency: 1480, duration: 0.22, type: "triangle", gain: 0.035 },
      { start: 0.12, frequency: 1040, endFrequency: 1760, duration: 0.16, type: "sine", gain: 0.022 }
    ],
    toggle: [
      { frequency: 330, endFrequency: 660, duration: 0.11, type: "triangle", gain: 0.035 },
      { start: 0.08, frequency: 660, endFrequency: 990, duration: 0.13, type: "sine", gain: 0.026 }
    ],
    tap: [
      { frequency: 280, endFrequency: 420, duration: 0.08, type: "triangle", gain: 0.026 }
    ]
  };
  (sounds[type] || sounds.tap).forEach((note) => playTone(ctx, note));
}

function resizeCanvas() {
  if (!ambientCanvasEnabled || !ctx) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.round(Math.min(220, Math.max(96, window.innerWidth / 7)));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 1.4 + 0.35,
    speed: Math.random() * 0.26 + 0.06,
    phase: Math.random() * Math.PI * 2
  }));
}

function drawVortex(time) {
  const centerX = window.innerWidth * (0.72 + (pointer.x - 0.5) * 0.08);
  const centerY = window.innerHeight * (0.42 + (pointer.y - 0.5) * 0.06);
  const energy = 1 + scrollBoost * 0.55;
  const pulse = (1 + Math.sin(time * 0.0028) * 0.08) * energy;

  for (let ring = 0; ring < 7; ring += 1) {
    const radius = ((time * (0.095 + scrollBoost * 0.06) + ring * 72) % 520) + 38;
    const alpha = Math.max(0, 0.2 - radius / 1100);
    ctx.beginPath();
    ctx.strokeStyle = `rgba(242, 199, 111, ${alpha})`;
    ctx.lineWidth = 1.2 + ring * 0.28;
    ctx.arc(centerX, centerY, radius * pulse, 0, Math.PI * 2);
    ctx.stroke();
  }

  for (let arm = 0; arm < 7; arm += 1) {
    ctx.beginPath();
    for (let step = 0; step < 132; step += 1) {
      const progress = step / 131;
      const angle = progress * Math.PI * (5.8 + scrollBoost * 1.4) + arm * 0.96 + time * (0.0019 + scrollBoost * 0.001);
      const radius = 16 + progress * 480 * pulse;
      const wave = Math.sin(progress * 20 + time * 0.0048 + arm) * (18 + scrollBoost * 26);
      const x = centerX + Math.cos(angle) * (radius + wave);
      const y = centerY + Math.sin(angle) * (radius * 0.48 + wave);
      if (step === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    const hueAlpha = 0.18 - arm * 0.018;
    ctx.strokeStyle = arm % 2 === 0 ? `rgba(73, 189, 136, ${hueAlpha})` : `rgba(216, 182, 255, ${hueAlpha})`;
    ctx.lineWidth = 2.2 + scrollBoost * 1.8;
    ctx.stroke();
  }
}

function drawEnergyBands(time) {
  const bandCount = 4;
  for (let i = 0; i < bandCount; i += 1) {
    const y = ((time * (0.035 + i * 0.01) + i * window.innerHeight * 0.27) % (window.innerHeight + 160)) - 80;
    const alpha = 0.08 + scrollBoost * 0.16;
    ctx.save();
    ctx.translate(window.innerWidth * 0.5, y);
    ctx.rotate((i % 2 === 0 ? -1 : 1) * 0.16);
    ctx.fillStyle = i % 2 === 0 ? `rgba(242, 199, 111, ${alpha})` : `rgba(73, 189, 136, ${alpha})`;
    ctx.fillRect(-window.innerWidth * 0.78, -1, window.innerWidth * 1.56, 2 + scrollBoost * 2);
    ctx.restore();
  }
}

function spawnBurst(x, y, count = 18) {
  if (reduceMotion || !ambientCanvasEnabled) return;
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3.8 + 1.1;
    sparks.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: Math.random() * 34 + 26,
      maxLife: 60,
      radius: Math.random() * 2.4 + 0.8,
      hue: Math.random() > 0.5 ? "gold" : "green"
    });
  }
  sparks = sparks.slice(-180);
}

function drawSparks() {
  sparks = sparks.filter((spark) => spark.life > 0);
  sparks.forEach((spark) => {
    spark.x += spark.vx;
    spark.y += spark.vy;
    spark.vx *= 0.982;
    spark.vy *= 0.982;
    spark.life -= 1;
    const alpha = Math.max(0, spark.life / spark.maxLife);
    ctx.beginPath();
    ctx.fillStyle = spark.hue === "gold" ? `rgba(242, 199, 111, ${alpha})` : `rgba(73, 189, 136, ${alpha})`;
    ctx.arc(spark.x, spark.y, spark.radius * (1 + alpha), 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawStars(time = 0) {
  if (!ambientCanvasEnabled || !ctx) return;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  drawEnergyBands(time);
  drawVortex(time);

  stars.forEach((star, index) => {
    const driftX = (pointer.x - 0.5) * (index % 7) * 0.8;
    const driftY = (pointer.y - 0.5) * (index % 5) * 0.6;
    const alpha = 0.28 + Math.sin(time * 0.0014 + star.phase) * 0.22;
    star.y += star.speed * (1 + scrollBoost * 2.5);
    if (star.y > window.innerHeight + 8) {
      star.y = -8;
      star.x = Math.random() * window.innerWidth;
    }

    ctx.beginPath();
    ctx.fillStyle = `rgba(242, 199, 111, ${Math.max(0.16, alpha)})`;
    ctx.arc(star.x + driftX, star.y + driftY, star.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  for (let i = 0; i < stars.length; i += 1) {
    const a = stars[i];
    for (let j = i + 1; j < stars.length; j += 19) {
      const b = stars[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 96) {
        ctx.strokeStyle = `rgba(73, 189, 136, ${0.12 * (1 - distance / 96)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
  drawSparks();

  ctx.restore();
  scrollBoost *= 0.965;
  document.documentElement.style.setProperty("--scroll-boost", scrollBoost.toFixed(3));
  if (!reduceMotion) {
    animationFrame = requestAnimationFrame(drawStars);
  }
}

function syncScrollState() {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const progress = Math.min(1, Math.max(0, window.scrollY / max));
  const velocity = Math.min(1, Math.abs(window.scrollY - lastScrollY) / 80);
  scrollBoost = Math.max(scrollBoost * 0.86, velocity);
  lastScrollY = window.scrollY;
  document.documentElement.style.setProperty("--scroll-progress", `${progress * 100}%`);
  document.documentElement.style.setProperty("--scroll-boost", scrollBoost.toFixed(3));
}

function updateScrollState() {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = null;
    syncScrollState();
  });
}

function setupReveals() {
  const revealTargets = document.querySelectorAll(".intro-band, .realm-stage, .gallery-band figure, .timeline-item, .planner-content");
  revealTargets.forEach((target) => target.setAttribute("data-reveal", ""));
  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );
  revealTargets.forEach((target) => observer.observe(target));
}

function setupMotionBudget() {
  const motionTargets = document.querySelectorAll(".hero, .night-panel, .signal-section, .realm-stage, .gallery-band, .timeline, .planner-media, .planner-content");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    motionTargets.forEach((target) => target.classList.add("is-motion-active"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-motion-active", entry.isIntersecting);
      });
    },
    { rootMargin: "140px 0px", threshold: 0.01 }
  );
  motionTargets.forEach((target) => observer.observe(target));
}

function clearBeastPass() {
  document.body.classList.remove("is-beast-pass");
  document.body.classList.remove("is-ticket-nova");
  document.body.classList.remove("is-soul-shock");
  document.body.classList.remove("is-alien-surge");
}

function setBeastRoute() {
  const root = document.documentElement;
  const compact = window.innerWidth < 620;
  const y = compact ? 19 + Math.random() * 8 : 12 + Math.random() * 18;
  const midScale = compact ? 0.76 + Math.random() * 0.12 : 0.62 + Math.random() * 0.12;
  const midX = compact ? 66 + Math.random() * 10 : 56 + Math.random() * 10;
  const impactX = compact ? -26 + Math.random() * 16 : 4 + Math.random() * 18;
  const impactY = compact ? 18 + Math.random() * 20 : 16 + Math.random() * 24;
  const splitBase = compact ? 22 + Math.random() * 8 : 13 + Math.random() * 13;
  const glyphX = compact ? 35 + Math.random() * 15 : 34 + Math.random() * 24;
  const glyphY = compact ? 23 + Math.random() * 15 : 11 + Math.random() * 17;
  const soulCenterX = compact ? 45 + Math.random() * 10 : 44 + Math.random() * 18;
  const soulCenterY = compact ? 34 + Math.random() * 12 : 24 + Math.random() * 15;
  const soulMidScale = compact ? 0.76 + Math.random() * 0.12 : 0.82 + Math.random() * 0.16;
  const alienCoreX = compact ? 58 + Math.random() * 18 : 56 + Math.random() * 28;
  const alienCoreY = compact ? 18 + Math.random() * 20 : 12 + Math.random() * 24;
  const props = {
    "--beast-y": `${y.toFixed(1)}%`,
    "--beast-start-lift": `${(6 + Math.random() * 5).toFixed(1)}vh`,
    "--beast-mid-x": `${midX.toFixed(1)}vw`,
    "--beast-mid-lift": `${(-7 + Math.random() * 7).toFixed(1)}vh`,
    "--beast-mid-scale": midScale.toFixed(2),
    "--beast-late-x": `${(104 + Math.random() * 10).toFixed(1)}vw`,
    "--beast-late-lift": `${(-15 + Math.random() * 8).toFixed(1)}vh`,
    "--beast-late-scale": Math.max(0.46, midScale - 0.12).toFixed(2),
    "--beast-end-x": `${(130 + Math.random() * 12).toFixed(1)}vw`,
    "--beast-end-lift": `${(-22 + Math.random() * 8).toFixed(1)}vh`,
    "--beast-end-tilt": `${(10 + Math.random() * 8).toFixed(1)}deg`,
    "--impact-x": `${impactX.toFixed(1)}%`,
    "--impact-y": `${impactY.toFixed(1)}%`,
    "--split-a-y": `${splitBase.toFixed(1)}%`,
    "--split-b-y": `${(splitBase + 20 + Math.random() * 8).toFixed(1)}%`,
    "--split-c-y": `${(splitBase + 42 + Math.random() * 9).toFixed(1)}%`,
    "--strike-a-x": `${(58 + Math.random() * 28).toFixed(1)}%`,
    "--strike-b-x": `${(18 + Math.random() * 28).toFixed(1)}%`,
    "--strike-c-x": `${(68 + Math.random() * 18).toFixed(1)}%`,
    "--glyph-x": `${glyphX.toFixed(1)}%`,
    "--glyph-y": `${glyphY.toFixed(1)}%`,
    "--soul-y": `${(compact ? 12 + Math.random() * 10 : 3 + Math.random() * 11).toFixed(1)}%`,
    "--soul-mid-x": `${(compact ? 34 + Math.random() * 12 : 42 + Math.random() * 16).toFixed(1)}vw`,
    "--soul-mid-lift": `${(compact ? -5 + Math.random() * 7 : -13 + Math.random() * 10).toFixed(1)}vh`,
    "--soul-mid-scale": soulMidScale.toFixed(2),
    "--soul-late-x": `${(compact ? 72 + Math.random() * 10 : 78 + Math.random() * 13).toFixed(1)}vw`,
    "--soul-late-lift": `${(compact ? -17 + Math.random() * 9 : -24 + Math.random() * 9).toFixed(1)}vh`,
    "--soul-late-scale": Math.min(1.34, soulMidScale + 0.34).toFixed(2),
    "--soul-end-x": `${(compact ? 102 + Math.random() * 9 : 112 + Math.random() * 14).toFixed(1)}vw`,
    "--soul-end-lift": `${(compact ? -31 + Math.random() * 8 : -36 + Math.random() * 11).toFixed(1)}vh`,
    "--soul-end-scale": Math.min(1.72, soulMidScale + 0.72).toFixed(2),
    "--soul-center-x": `${soulCenterX.toFixed(1)}%`,
    "--soul-center-y": `${soulCenterY.toFixed(1)}%`,
    "--breach-x": `${(soulCenterX + 1 + Math.random() * 8).toFixed(1)}%`,
    "--breach-y": `${(Math.max(15, soulCenterY - 8 + Math.random() * 8)).toFixed(1)}%`,
    "--alien-core-x": `${alienCoreX.toFixed(1)}%`,
    "--alien-core-y": `${alienCoreY.toFixed(1)}%`,
    "--alien-beam-y": `${(compact ? 28 + Math.random() * 30 : 20 + Math.random() * 42).toFixed(1)}%`,
    "--alien-word-x": `${(compact ? 50 : 34 + Math.random() * 28).toFixed(1)}%`,
    "--alien-word-y": `${(compact ? 19 + Math.random() * 18 : 12 + Math.random() * 22).toFixed(1)}%`
  };
  Object.entries(props).forEach(([name, value]) => root.style.setProperty(name, value));
}

function triggerBeastPass({ force = false, nova = false, soul = false } = {}) {
  if (reduceMotion || (beastCooldown && !force)) return;
  const soulShock = soul || nova;
  beastCooldown = true;
  window.clearTimeout(beastRemoveTimer);
  window.clearTimeout(beastCooldownTimer);
  setBeastRoute();
  clearBeastPass();
  void document.body.offsetWidth;
  document.body.classList.add("is-beast-pass");
  document.body.classList.toggle("is-ticket-nova", nova);
  document.body.classList.toggle("is-soul-shock", soulShock);
  document.body.classList.add("is-alien-surge");
  beastRemoveTimer = window.setTimeout(clearBeastPass, soulShock ? 3180 : 2380);
  beastCooldownTimer = window.setTimeout(() => {
    beastCooldown = false;
  }, soulShock ? 3900 : 3300);
}

function isNovaTrigger(trigger) {
  return Boolean(trigger.closest("[data-ticket], .form-submit"));
}

function settleHashAnchor() {
  if (!window.location.hash) return;
  const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
  if (!target) return;
  const headerOffset = document.querySelector(".site-header")?.offsetHeight || 0;
  const targetTop = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerOffset);
  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, targetTop);
  root.style.scrollBehavior = previousBehavior;
}

function setRealm(nextRealm) {
  const realm = realms[nextRealm];
  state.realm = nextRealm;
  realmTabs.forEach((tab) => {
    const active = tab.dataset.realm === nextRealm;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  realmImage.style.setProperty("--realm-image", realm.image);
  realmImage.setAttribute("aria-label", realm.alt);
  realmKicker.textContent = realm.kicker;
  realmTitle.textContent = realm.title;
  realmDescription.textContent = realm.description;
  realmList.innerHTML = "";
  realm.list.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    realmList.append(li);
  });
}

function updateSummary(confirmed = false) {
  const data = new FormData(plannerForm);
  const repoCount = Number(data.get("guests") || 1);
  const route = data.get("time") || "Review evidence";
  const includeEvidence = data.get("guide") === "on";
  const ticket = tickets[state.ticket];
  const glow = `GitHub signal level ${state.glow}`;
  const checkCount = Math.min(16, 10 + repoCount + state.glow);
  const apexBase = {
    wanderer: 980,
    oracle: 1040,
    solstice: 1090
  };
  const vectors = {
    wanderer: "Reviewer packet",
    oracle: "Actions",
    solstice: "Contribute"
  };
  const skyline = {
    wanderer: "Evidence",
    oracle: "Action",
    solstice: "Issue / PR"
  };
  const apexScore = apexBase[state.ticket] + repoCount * 7 + state.glow * 11;
  const resonance = Math.min(100, 78 + repoCount * 2 + state.glow * 4 + (state.ticket === "oracle" ? 4 : 0));

  if (gateTicket) gateTicket.textContent = ticket.name;
  if (gatePhase) gatePhase.textContent = ticket.channel;
  if (gateGlow) gateGlow.textContent = `Level ${state.glow}`;
  if (apexGate) apexGate.textContent = `GITHUB SIGNAL ${apexScore}`;
  if (apexAltitude) apexAltitude.textContent = "Public";
  if (apexResonance) apexResonance.textContent = `v0.9.8`;
  if (apexVector) apexVector.textContent = vectors[state.ticket];
  if (skySeal) skySeal.textContent = `ACTIONS READY ${checkCount}`;
  if (skylineCurrent) skylineCurrent.textContent = skyline[state.ticket];
  if (plannerBand) plannerBand.style.setProperty("--apex-power", (resonance / 100).toFixed(2));
  if (ascensionTitle) ascensionTitle.textContent = `${ticket.name} / ${ticket.channel}`;
  if (ascensionCopy) {
    const routes = {
      wanderer: "GitHub repoを開き、reviewer evidence、release、Actionsへ流す検証ルートです。",
      oracle: "Marketplace ActionからActionsで試し、reportとartifactをGitHub上に残すルートです。",
      solstice: "IssuesやPull requestsで反応を返し、reviewer evidenceへつなげる貢献ルートです。"
    };
    ascensionCopy.textContent = routes[state.ticket];
  }

  summaryPanel.innerHTML = `
    <p class="eyebrow dark">${confirmed ? "GitHub launch generated" : "Launch plan"}</p>
    <h3>${ticket.name} / ${repoCount} repo${repoCount > 1 ? "s" : ""}</h3>
    <p>${route}で開始。${includeEvidence ? "reviewer evidence導線つき。" : "GitHub導線のみ。"}${glow}。Evidence、Action、Issue、PRへ流すoss-signal launch planです。</p>
  `;

  if (confirmed) {
    entryStatus.textContent = `${ticket.name} ready`;
  }
}

function setTicket(ticketName) {
  state.ticket = ticketName;
  ticketButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.ticket === ticketName);
  });
  updateSummary();
}

realmTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setRealm(tab.dataset.realm);
    playSfx("tab");
  });
});

ticketButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setTicket(button.dataset.ticket);
    playSfx("tab");
  });
});

beastTriggers.forEach((trigger) => {
  trigger.addEventListener("pointerenter", () => {
    triggerBeastPass();
    playSfx("hover");
  });
  trigger.addEventListener("focus", () => {
    triggerBeastPass();
    playSfx("hover");
  });
  trigger.addEventListener("click", () => {
    const shock = isNovaTrigger(trigger);
    triggerBeastPass({ force: true, nova: shock, soul: shock });
    playSfx(shock ? "launch" : "tap");
  });
});

celestialBeast?.addEventListener("animationend", (event) => {
  if (
    event.animationName === "beast-pass" &&
    !document.body.classList.contains("is-ticket-nova") &&
    !document.body.classList.contains("is-soul-shock")
  ) {
    clearBeastPass();
  }
});

plannerForm.addEventListener("input", (event) => {
  if (event.target === glowRange) {
    state.glow = Number(glowRange.value);
  }
  updateSummary();
});

plannerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  updateSummary(true);
  playSfx("launch");
  if (!document.body.classList.contains("is-ticket-nova")) {
    triggerBeastPass({ force: true, nova: true, soul: true });
  }
});

soundToggle?.addEventListener("click", () => {
  const next = !soundEnabled;
  if (next) {
    getSoundContext();
  }
  setSoundEnabled(next);
  if (next) {
    playSfx("toggle");
  }
});

navToggle.addEventListener("click", () => {
  nav.classList.toggle("is-open");
  const open = nav.classList.contains("is-open");
  navToggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
});

nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-label", "メニューを開く");
  }
});

window.addEventListener("pointermove", (event) => {
  pointer = {
    x: event.clientX / window.innerWidth,
    y: event.clientY / window.innerHeight
  };
  if (!pointerFrame) {
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = null;
      cursorLight.style.setProperty("--x", `${pointer.x * window.innerWidth}px`);
      cursorLight.style.setProperty("--y", `${pointer.y * window.innerHeight}px`);
      document.documentElement.style.setProperty("--portal-x", pointer.x);
      document.documentElement.style.setProperty("--portal-y", pointer.y);
      alienLayer?.style.setProperty("--alien-shift-x", `${((pointer.x - 0.5) * 18).toFixed(1)}px`);
      alienLayer?.style.setProperty("--alien-shift-y", `${((pointer.y - 0.4) * 14).toFixed(1)}px`);
      alienLayer?.style.setProperty("--alien-shift-wide-x", `${((pointer.x - 0.5) * 22).toFixed(1)}px`);
      alienLayer?.style.setProperty("--alien-shift-wide-y", `${((pointer.y - 0.4) * 18).toFixed(1)}px`);
    });
  }
  if (event.timeStamp - lastSparkTime > 46) {
    spawnBurst(event.clientX, event.clientY, 2);
    lastSparkTime = event.timeStamp;
  }
});

window.addEventListener("pointerdown", (event) => {
  spawnBurst(event.clientX, event.clientY, 34);
});

window.addEventListener("scroll", updateScrollState, { passive: true });
if (ambientCanvasEnabled) {
  window.addEventListener("resize", resizeCanvas);
}

setRealm("moon");
syncScrollState();
setupReveals();
setupMotionBudget();
if (ambientCanvasEnabled) {
  resizeCanvas();
  drawStars();
}
updateSummary();

window.addEventListener("load", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
  requestAnimationFrame(settleHashAnchor);
  window.setTimeout(settleHashAnchor, 240);
  if (!reduceMotion) {
    window.setTimeout(() => triggerBeastPass({ force: true }), 980);
    beastInterval = window.setInterval(() => triggerBeastPass({ force: true }), 22000);
  }
});

window.addEventListener("hashchange", () => {
  requestAnimationFrame(settleHashAnchor);
});

window.addEventListener("beforeunload", () => {
  cancelAnimationFrame(animationFrame);
  cancelAnimationFrame(pointerFrame);
  cancelAnimationFrame(scrollFrame);
  window.clearInterval(beastInterval);
  window.clearTimeout(beastRemoveTimer);
  window.clearTimeout(beastCooldownTimer);
});
