import { Game } from './engine/core/Game';
import { TitleScreen } from './engine/core/screens/TitleScreen';
import { GM_Pong } from './pong/GM_Pong';
import { GM_BattlePong } from './pong/GM_BattlePong';
import { CANVAS, GAME_DATA } from './pong/config';

window.onload = () => {
  const game = new Game({
    canvasId: '#gameCanvas',
    size: { width: CANVAS.WIDTH, height: CANVAS.HEIGHT },
    tickRate: GAME_DATA.TICK_RATE,
    maxFrameTime: GAME_DATA.MAX_FRAME_TIME,
    gameMode: GM_BattlePong, // TODO: add the ability to have multiple game modes by selection from TitleScreen
  });
  game.screens.push(new TitleScreen({ title: 'PONG' }));
  game.run();
};
