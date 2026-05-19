import { loadGames } from "./game-data.js";
import { randomizeBtn, renderGameList } from "./dom.js";
import { initIdleTrack, runPickAnimation } from "./slot-machine.js";

let games = [];

async function init() {
  games = await loadGames();
  renderGameList(games);
  initIdleTrack(games);
  randomizeBtn.addEventListener("click", () => runPickAnimation(games));
}

init();
