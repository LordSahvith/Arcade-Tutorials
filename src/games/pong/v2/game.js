import { Game } from './engine/core/Game';
import { PongGameMode } from './pong/PongGameMode';
import { CANVAS, GAME_DATA } from './pong/config';

window.onload = () => {
  const game = new Game({
    canvasId: '#gameCanvas',
    size: { width: CANVAS.WIDTH, height: CANVAS.HEIGHT },
    gameMode: PongGameMode,
    tickRate: GAME_DATA.TICK_RATE,
    maxFrameTime: GAME_DATA.MAX_FRAME_TIME,
  });
  game.run();
};
