import { Pawn } from '../../engine/core/actors/Pawn';
import { clamp } from '../../engine/math/math';

export class Paddle extends Pawn {
  /**
   * @param {{x: number, y: number}} pos
   * @param {{x: number, y: number}} vel
   * @param {{width: number, height: number}} size
   * @param {string} color
   */
  constructor({
    pos,
    vel = { x: 0, y: 420 },
    size = { width: 20, height: 90 },
    color = 'red',
  }) {
    super(pos, color);
    this.vel = { ...vel };
    this.size = { ...size };
  }

  beginPlay() {
    // TODO: add rect component
  }

  applyMovement(deltaTime) {
    const dir = clamp(this.inputY, -1, 1);
    this.pos.y += dir * this.vel.y * deltaTime;
    this.pos.y = clamp(
      this.pos.y,
      0,
      this.world.renderer.height - this.size.height
    );
  }

  render(renderer, alpha) {
    renderer.drawRect(this.getRenderPos(alpha), this.size, this.color);
  }
}
