import { CONFETTI_COLORS, SLOT, SPIN } from "./config.js";
import { pickRandomGame } from "./game-data.js";
import {
  hideSelectedLink,
  setRandomizeDisabled,
  showSelectedLink,
  slotTrack,
  slotViewport,
} from "./dom.js";

const itemStride = SLOT.itemWidth + SLOT.itemGap;

let isSpinning = false;

function viewportCenter() {
  // clientWidth excludes border so items align with CSS indicator (left: 50%)
  return slotTrack.parentElement.clientWidth / 2;
}

function xForIndex(index) {
  return Math.round(viewportCenter() - SLOT.itemWidth / 2 - index * itemStride);
}

function setTrackPosition(index) {
  slotTrack.style.transform = `translate3d(${xForIndex(index)}px, 0, 0)`;
}

function buildTrack(items) {
  slotTrack.innerHTML = "";
  items.forEach((game) => {
    const div = document.createElement("div");
    div.className = "slot-item";
    div.textContent = game.name;
    slotTrack.appendChild(div);
  });
}

function buildSpinItems(games, winner) {
  return Array.from({ length: SLOT.spinTotalItems }, (_, index) =>
    index === SLOT.winnerIndex ? winner : pickRandomGame(games)
  );
}

function launchConfetti() {
  const rect = slotViewport.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  for (let i = 0; i < 36; i++) {
    const dot = document.createElement("div");
    dot.className = "confetti-dot";
    const angle = (i / 36) * Math.PI * 2;
    const speed = 90 + Math.random() * 130;
    const size = 6 + Math.random() * 7;

    dot.style.cssText = [
      `left:${cx}px`,
      `top:${cy}px`,
      `width:${size}px`,
      `height:${size}px`,
      `background:${CONFETTI_COLORS[i % CONFETTI_COLORS.length]}`,
      `--dx:${(Math.cos(angle) * speed + (Math.random() - 0.5) * 50).toFixed(1)}px`,
      `--dy:${(Math.sin(angle) * speed - Math.random() * 80).toFixed(1)}px`,
      `--rot:${Math.floor(Math.random() * 600)}deg`,
      `--dur:${(0.7 + Math.random() * 0.55).toFixed(2)}s`,
      `--delay:${(Math.random() * 0.12).toFixed(2)}s`,
    ].join(";");

    document.body.appendChild(dot);
    dot.addEventListener("animationend", () => dot.remove(), { once: true });
  }
}

function showWinnerResult(winner) {
  slotViewport.classList.remove("is-spinning", "is-slowing");
  slotViewport.classList.add("is-winner");
  launchConfetti();
  slotTrack.children[SLOT.winnerIndex].classList.add("slot-item--winner");
  showSelectedLink(winner);
  setRandomizeDisabled(false);
  isSpinning = false;
}

export function initIdleTrack(games) {
  if (games.length === 0) return;

  const shuffled = [...games].sort(() => Math.random() - 0.5).slice(0, SLOT.idleTrackItems);
  buildTrack(shuffled);

  slotTrack.style.transition = "none";
  setTrackPosition(Math.floor(shuffled.length / 2));
}

export function runPickAnimation(games) {
  if (isSpinning || games.length === 0) return;

  isSpinning = true;
  setRandomizeDisabled(true);
  hideSelectedLink();
  slotViewport.classList.remove("is-winner", "is-slowing", "is-spinning");

  const winner = pickRandomGame(games);
  const items = buildSpinItems(games, winner);
  buildTrack(items);

  // Snap to start without transition, then animate to winner.
  slotTrack.style.transition = "none";
  setTrackPosition(SLOT.startIndex);

  // Force layout before enabling transition.
  void slotTrack.offsetWidth;
  slotViewport.classList.add("is-spinning");
  slotTrack.style.transition = `transform ${SPIN.durationMs}ms ${SPIN.easing}`;
  setTrackPosition(SLOT.winnerIndex);

  let hasFinished = false;
  const finishSpin = () => {
    if (hasFinished) return;
    hasFinished = true;

    // Snap to exact final pixel and wait a frame before winner effects.
    slotTrack.style.transition = "none";
    setTrackPosition(SLOT.winnerIndex);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        showWinnerResult(winner);
      });
    });
  };

  const onTransitionEnd = (event) => {
    if (event.target !== slotTrack || event.propertyName !== "transform") return;
    slotTrack.removeEventListener("transitionend", onTransitionEnd);
    finishSpin();
  };

  slotTrack.addEventListener("transitionend", onTransitionEnd);
  setTimeout(() => {
    slotTrack.removeEventListener("transitionend", onTransitionEnd);
    finishSpin();
  }, SPIN.durationMs + SPIN.endFallbackMs);
}
