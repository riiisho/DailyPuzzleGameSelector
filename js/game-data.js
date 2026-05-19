import { fallbackGames } from "./config.js";

export function sortGamesByName(items) {
  return [...items].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
}

export function normalizeGames(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  return data.filter((game) => game.name && game.url);
}

export async function loadGames() {
  try {
    const response = await fetch("./games.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch game list: ${response.status}`);
    }

    const data = await response.json();
    const normalized = normalizeGames(data);
    if (normalized.length === 0) {
      throw new Error("Game list is empty or invalid");
    }

    return sortGamesByName(normalized);
  } catch (error) {
    console.error(error);
    return sortGamesByName(fallbackGames);
  }
}

export function pickRandomGame(items) {
  return items[Math.floor(Math.random() * items.length)];
}
