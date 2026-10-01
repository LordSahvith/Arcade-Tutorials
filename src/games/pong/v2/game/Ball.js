import { Actor } from "./Actor";
import { CANVAS } from "./data";

export class Ball extends Actor {
  /**
   * @param {{x: number, y: number}} pos
   * @param {{x: number, y: number}} vel
   * @param {number} radius
   * @param {string} color
   */
  constructor(pos, vel = { x: 200, y: 50 }, radius = 10, color = "red") {
    super(pos, color);
    this.vel = { ...vel };
    this.radius = radius;
  }

  beginPlay() {
    // add circle component
    this.bIsLoading = false;
  }

  tick(deltaTime) {
    super.tick(deltaTime);

    this.pos.x += this.vel.x * deltaTime;
    this.pos.y += this.vel.y * deltaTime;

    this.checkWallCollision();
  }

  render(renderer, alpha) {
    renderer.drawCircle(this.getRenderPos(alpha), this.radius, this.color);
  }

  serve(dir) {
    this.teleport({ x: CANVAS.WIDTH / 2, y: CANVAS.HEIGHT / 2 });
    this.vel.x = dir * Math.abs(this.vel.x);
    this.bIsLoading = false;
  }

  checkWallCollision() {
    // left / right: out of bounds, let GameMode score it
    if (this.pos.x + this.radius < 0) this.world.gameMode.onBallOut("left");
    if (this.pos.x - this.radius > CANVAS.WIDTH && !this.bIsLoading)
      this.world.gameMode.onBallOut("right");

    // top
    if (this.pos.y - this.radius < 0) {
      this.pos.y = this.radius; // nudge ball away
      this.vel.y = Math.abs(this.vel.y); // always down (+1)
    }

    // bottom
    if (this.pos.y + this.radius > CANVAS.HEIGHT) {
      this.pos.y = CANVAS.HEIGHT - this.radius; // nudge ball away
      this.vel.y = -Math.abs(this.vel.y); // always up (-1)
    }
  }
}
