import { Screen } from './Screen';

const LINE_SPACING = 40;

export class GameOverScreen extends Screen {
  bBlocksRender = false;

  /**
   * @param {string} heading e.g. "Left player wins!"
   * @param {string[]} lines summary lines, e.g. the final score
   */
  constructor({
    heading = 'GAME OVER',
    lines = [],
    prompt = 'Press Enter to play again',
    restartBtn = 'Enter',
    color = 'white',
  } = {}) {
    super();
    this.heading = heading;
    this.lines = lines;
    this.prompt = prompt;
    this.restartBtn = restartBtn;
    this.color = color;
  }

  tick() {
    if (this.game.input.wasPressed(this.restartBtn)) this.game.startMatch();
  }

  render(renderer) {
    const x = renderer.width / 2;
    let y = renderer.height / 2 - LINE_SPACING;

    renderer.drawRect(
      { x: 0, y: 0 },
      { width: renderer.width, height: renderer.height },
      'rgba(0, 0, 0, 0.6)'
    );

    renderer.drawText(
      { x, y },
      this.heading,
      '36px monospace',
      this.color,
      'center'
    );

    for (const line of this.lines) {
      y += LINE_SPACING;
      renderer.drawText({ x, y }, line, '20px monospace', this.color, 'center');
    }

    renderer.drawText(
      { x, y: y + LINE_SPACING },
      this.prompt,
      '16px monospace',
      this.color,
      'center'
    );
  }
}
