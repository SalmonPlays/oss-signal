const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const soundButton = document.querySelector("[data-sound]");
const burstTargets = document.querySelectorAll("[data-burst]");

let soundOn = false;
let audioContext;
let burstTimer;

function context() {
  if (!audioContext) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    audioContext = new AudioContext();
  }
  if (audioContext.state === "suspended") audioContext.resume();
  return audioContext;
}

function tone(ctx, frequency, endFrequency, start, duration, gain) {
  const oscillator = ctx.createOscillator();
  const volume = ctx.createGain();
  const at = ctx.currentTime + start;
  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(frequency, at);
  oscillator.frequency.exponentialRampToValueAtTime(endFrequency, at + duration);
  volume.gain.setValueAtTime(0.0001, at);
  volume.gain.exponentialRampToValueAtTime(gain, at + 0.015);
  volume.gain.exponentialRampToValueAtTime(0.0001, at + duration);
  oscillator.connect(volume);
  volume.connect(ctx.destination);
  oscillator.start(at);
  oscillator.stop(at + duration + 0.03);
}

function playBurstSound() {
  if (!soundOn || reduceMotion) return;
  const ctx = context();
  if (!ctx) return;
  tone(ctx, 196, 82, 0, 0.16, 0.034);
  tone(ctx, 620, 1480, 0.045, 0.18, 0.026);
}

function burst() {
  if (reduceMotion) return;
  window.clearTimeout(burstTimer);
  document.body.classList.remove("is-bursting");
  requestAnimationFrame(() => {
    document.body.classList.add("is-bursting");
    playBurstSound();
    burstTimer = window.setTimeout(() => document.body.classList.remove("is-bursting"), 700);
  });
}

soundButton?.addEventListener("click", () => {
  soundOn = !soundOn;
  soundButton.classList.toggle("is-on", soundOn);
  soundButton.textContent = soundOn ? "on" : "sound";
  soundButton.setAttribute("aria-label", soundOn ? "効果音をオフにする" : "効果音をオンにする");
  if (soundOn) {
    const ctx = context();
    if (ctx) tone(ctx, 360, 720, 0, 0.11, 0.028);
  }
});

burstTargets.forEach((target) => {
  target.addEventListener("click", burst);
});
