import { World } from "./game/World";
import { GAME_DATA } from "./game/data";

function runGame() {
  const game = new World("#gameCanvas", {
    width: GAME_DATA.CANVAS.WIDTH,
    height: GAME_DATA.CANVAS.HEIGHT,
  });
  game.beginPlay();
}

window.onload = runGame;
