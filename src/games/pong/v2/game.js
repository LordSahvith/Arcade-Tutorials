import { Game } from './engine/core/Game';
import { TitleScreen } from './pong/screens/TitleScreen';
import { CANVAS, GAME_DATA } from './pong/config';

window.onload = () => {
  const game = new Game({
    canvasId: '#gameCanvas',
    size: { width: CANVAS.WIDTH, height: CANVAS.HEIGHT },
    tickRate: GAME_DATA.TICK_RATE,
    maxFrameTime: GAME_DATA.MAX_FRAME_TIME,
  });
  game.screens.push(new TitleScreen());
  game.run();
};
