import { World } from "./game/World";
import { CANVAS } from "./game/data";

function runGame() {
  const game = new World("#gameCanvas", {
    width: CANVAS.WIDTH,
    height: CANVAS.HEIGHT,
  });
  game.beginPlay();
}

/**
 * type="module" scripts run once the HTML is parsed, so runGame() could be
 * called directly. window.onload also waits for images and fonts to finish.
 */
window.onload = runGame;
