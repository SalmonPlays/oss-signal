const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const burstTargets = document.querySelectorAll("[data-burst]");

let burstTimer;

function burst() {
  if (reduceMotion) return;
  window.clearTimeout(burstTimer);
  document.body.classList.remove("is-bursting");
  requestAnimationFrame(() => {
    document.body.classList.add("is-bursting");
    burstTimer = window.setTimeout(() => document.body.classList.remove("is-bursting"), 700);
  });
}

burstTargets.forEach((target) => {
  target.addEventListener("click", burst);
});
