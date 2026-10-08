import { Actor } from '../../engine/core/actors/Actor';

export class HUD extends Actor {
  /**
   * @param {{x: number, y: number}} pos
   * @param {string} color
   */
  constructor({ name, pos, color = 'white' }) {
    super(name, pos, color);
  }

  drawScore(renderer) {
    const { left, right } = this.world.gameMode.score;
    renderer.drawText(
      this.pos,
      `${left} | ${right}`,
      '25px monospace',
      this.color,
      'center'
    );
  }

  render(renderer) {
    this.drawScore(renderer);
  }
}
