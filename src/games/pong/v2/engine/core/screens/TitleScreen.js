import { Screen } from './Screen';

export class TitleScreen extends Screen {
  constructor({
    title = 'GAME',
    prompt = 'Press Enter to start',
    startBtn = 'Enter',
    color = 'white',
  } = {}) {
    super();
    this.title = title;
    this.prompt = prompt;
    this.startBtn = startBtn;
    this.color = color;
  }

  tick() {
    if (this.game.input.wasPressed(this.startBtn)) this.game.startMatch();
  }

  render(renderer) {
    const x = renderer.width / 2;
    const y = renderer.height / 2;
    renderer.drawText(
      { x, y: y - 20 },
      this.title,
      '48px monospace',
      this.color,
      'center'
    );
    renderer.drawText(
      { x, y: y + 30 },
      this.prompt,
      '20px monospace',
      this.color,
      'center'
    );
  }
}
