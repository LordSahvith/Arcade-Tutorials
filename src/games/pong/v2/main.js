import { Game } from './engine/core/Game';
import { MenuScreen } from './engine/core/screens/MenuScreen';
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

  game.setTitleScreen(
    new MenuScreen({
      title: 'PONG',
      options: [
        {
          label: 'Original',
          type: 'gameMode',
          onSelect: game => game.startMatch(GM_Pong),
        },
        {
          label: 'Battle',
          type: 'gameMode',
          onSelect: game => game.startMatch(GM_BattlePong),
        },
        {
          label: 'Settings',
          type: 'setting',
          onSelect: game =>
            console.log('game.screens.push(new SettingsScreen())'),
        },
      ],
    })
  );
  game.run();
};
