export const CATEGORY_VISUALS = {
  arcade: { icon: "game", color: "#365ff5", light: "#e6edff" },
  puzzle: { icon: "puzzle", color: "#9564d4", light: "#eee4fa" },
  casual: { icon: "leaf", color: "#208569", light: "#daf2e4" },
  card: { icon: "card", color: "#d96b4b", light: "#ffe5d9" },
  action: { icon: "sword", color: "#d75572", light: "#ffe0e9" },
  shooter: { icon: "rocket", color: "#168a9b", light: "#d8f3f5" },
  strategy: { icon: "flag", color: "#bb861c", light: "#fff0c2" },
  simulation: { icon: "house", color: "#53904a", light: "#e7f2d3" },
  sports: { icon: "ball", color: "#df7d2e", light: "#ffead0" },
  racing: { icon: "car", color: "#4a7bba", light: "#dbeeff" },
};
export const COVER_CELLS = {
  2048: 0,
  snake: 1,
  tetris: 2,
  flappy: 3,
  petfeed: 4,
  farmclicker: 5,
  memory: 6,
  diceduel: 7,
};
const ICONS = {
  archery: "target",
  basketball: "ball",
  catcheggs: "heart",
  crossy: "car",
  elevator: "layers",
  flowfree: "puzzle",
  fruitcut: "sword",
  hanoi: "layers",
  knifehit: "target",
  lightsout: "bolt",
  ninjadash: "bolt",
  pianotile: "music",
  reaction: "bolt",
  shielddef: "target",
  simon: "grid",
  skiing: "flag",
  sokoban: "layers",
  stacker: "layers",
  whackmole: "target",
  planewar: "rocket",
  minesweeper: "grid",
  rps: "game",
};
export function visualFor(game) {
  return {
    ...CATEGORY_VISUALS[game.categories[0]],
    icon:
      ICONS[game.id] || CATEGORY_VISUALS[game.categories[0]]?.icon || "game",
  };
}
