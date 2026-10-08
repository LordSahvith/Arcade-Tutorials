import { Screen } from '../../engine/core/screens/Screen';
import { GameScreen } from '../../engine/core/screens/GameScreen';
import { PongGameMode } from '../PongGameMode';
import { MARGINS } from '../config';

export class TitleScreen extends Screen {
  tick() {
    if (this.game.input.wasPressed('Enter')) {
      this.game.screens.replace(new GameScreen(PongGameMode));
    }
  }

  render(renderer) {
    const x = renderer.width / 2;
    renderer.drawText(
      { x, y: renderer.height / 2 - MARGINS.SM },
      'PONG',
      '48px monospace',
      'white',
      'center'
    );
    renderer.drawText(
      { x, y: renderer.height / 2 + MARGINS.SM },
      'Press Enter to start',
      '20px monospace',
      'white',
      'center'
    );
  }
}
