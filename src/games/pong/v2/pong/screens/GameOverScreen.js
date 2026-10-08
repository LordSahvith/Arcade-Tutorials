import { Screen } from '../../engine/core/screens/Screen';
import { GameScreen } from '../../engine/core/screens/GameScreen';
import { PongGameMode } from '../PongGameMode';
import { MARGINS } from '../config';

export class GameOverScreen extends Screen {
  bBlocksRender = false;

  constructor(winner) {
    super();
    this.winner = winner;
  }

  tick() {
    if (this.game.input.wasPressed('Enter')) {
      this.game.screens.set(new GameScreen(PongGameMode));
    }
  }

  render(renderer) {
    // dim overlay + `${this.winner} player wins!` + "Press Enter to play again"
    renderer.drawRect(
      { x: 0, y: 0 },
      { width: renderer.width, height: renderer.height },
      'rgba(0, 0, 0, 0.5)'
    );
    renderer.drawText(
      { x: renderer.width / 2, y: renderer.height / 2 - MARGINS.MD },
      `${this.winner} player wins!`,
      '36px monospace',
      'white',
      'center'
    );
    renderer.drawText(
      { x: renderer.width / 2, y: renderer.height / 2 + MARGINS.MD },
      'Press Enter to play again',
      '20px monospace',
      'white',
      'center'
    );
  }
}
