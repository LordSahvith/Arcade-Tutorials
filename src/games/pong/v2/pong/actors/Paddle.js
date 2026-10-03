import { Actor } from "../../engine/core/Actor";

export class Paddle extends Actor {
  /**
   * @param {{x: number, y: number}} pos
   * @param {{x: number, y: number}} vel
   * @param {{width: number, height: number}} size
   * @param {string} color
   */
  constructor(
    pos,
    vel = { x: 0, y: 420 },
    size = { width: 20, height: 90 },
    color = "red",
  ) {
    super(pos, color);
    this.vel = { ...vel };
    this.size = { ...size };
  }

  render(renderer, alpha) {
    renderer.drawRect(this.getRenderPos(alpha), this.size, this.color);
  }
}
