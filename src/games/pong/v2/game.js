import { Game } from "./engine/core/Game";
import { PongGameMode } from "./pong/PongGameMode";
import { CANVAS } from "./pong/config";

window.onload = () => {
  const game = new Game({
    canvasId: "#gameCanvas",
    size: { width: CANVAS.WIDTH, height: CANVAS.HEIGHT },
    gameMode: PongGameMode,
  });
  game.run();
};
