import { Screen } from './Screen';

export class PauseScreen extends Screen {
  bBlocksRender = false; // keep the frozen game visible underneath

  tick() {
    if (this.game.input.wasPressed('Escape')) this.game.screens.pop();
  }

  render(renderer) {
    renderer.drawRect(
      { x: 0, y: 0 },
      { width: renderer.width, height: renderer.height },
      'rgba(0, 0, 0, 0.5)'
    );
    renderer.drawText(
      { x: renderer.width / 2, y: renderer.height / 2 },
      'PAUSED',
      '36px monospace',
      'white',
      'center'
    );
  }
}
