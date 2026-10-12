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
  });
  game.screens.push(
    new TitleScreen({
      title: 'PONG',
      options: [
        {
          title: 'Original',
          type: 'gameMode',
          className: GM_Pong,
          bIsSelected: true,
        },
        {
          title: 'Battle',
          type: 'gameMode',
          className: GM_BattlePong,
          bIsSelected: false,
        },
        {
          title: 'Settings',
          type: 'setting',
          className: null,
          bIsSelected: false,
        },
      ],
    })
  );
  game.run();
};
