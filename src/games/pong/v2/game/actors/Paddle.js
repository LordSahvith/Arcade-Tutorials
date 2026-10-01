import { Actor } from "./Actor";

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
    size = { x: 20, y: 90 },
    color = "red",
  ) {
    super(pos, color);
    this.vel = { ...vel };
    this.size = { ...size };
  }

  beginPlay() {
    // add rect component
  }

  tick(deltaTime) {
    super.tick(deltaTime);
  }

  render(renderer, alpha) {
    renderer.drawRect(this.getRenderPos(alpha), this.size, this.color);
  }

  move() {
    // const dir = input.axis(["KeyW", "ArrowUp"], ["KeyS", "ArrowDown"]);
  }
}
