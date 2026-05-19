export const randomizeBtn = document.getElementById("randomize-btn");
export const selectedLink = document.getElementById("selected-link");
export const gameList = document.getElementById("game-list");
export const slotTrack = document.getElementById("slot-track");
export const slotViewport = document.querySelector(".slot-viewport");

export function renderGameList(items) {
  gameList.innerHTML = "";

  items.forEach((game) => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = game.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = game.name;
    li.appendChild(link);
    gameList.appendChild(li);
  });
}

export function setRandomizeDisabled(disabled) {
  randomizeBtn.disabled = disabled;
}

export function hideSelectedLink() {
  selectedLink.classList.add("is-hidden");
}

export function showSelectedLink(game) {
  selectedLink.textContent = `Play ${game.name}`;
  selectedLink.href = game.url;
  selectedLink.classList.remove("is-hidden");
}
