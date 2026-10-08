import { Actor } from '../../engine/core/actors/Actor';
import { MARGINS } from '../config';

export class Court extends Actor {
  /**
   * @param {{x: number, y: number}} pos top of the net
   * @param {string} color
   */
  constructor({ name, pos, color = '#a800a8' }) {
    super(name, pos, color);
    this.dash = MARGINS.SM;
    this.gap = MARGINS.SM;
    this.lineWidth = 3;
  }

  drawCourt(renderer) {
    const grad = renderer.ctx.createRadialGradient(
      this.world.renderer.width / 2,
      this.world.renderer.height / 2,
      300, // end inner circle
      this.world.renderer.width / 2,
      this.world.renderer.height / 2,
      this.world.renderer.width // end outer circle
    );

    grad.addColorStop(0, 'black');
    grad.addColorStop(1, '#a800a8');

    renderer.drawRect(
      { x: 0, y: 0 },
      { width: this.world.renderer.width, height: this.world.renderer.height },
      grad
    );
  }

  drawNet(renderer) {
    const courtLength = this.world.renderer.height - this.pos.y * 2;
    const end = { x: this.pos.x, y: this.pos.y + courtLength };
    renderer.drawLine(
      this.pos,
      end,
      this.dash,
      this.gap,
      this.lineWidth,
      this.color
    );
  }

  render(renderer) {
    this.drawCourt(renderer);
    this.drawNet(renderer);
  }
}
