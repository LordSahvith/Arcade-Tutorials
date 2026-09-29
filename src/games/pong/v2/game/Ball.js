import { CANVAS } from "./data";
import { lerp } from "./lib/math";

export class Ball {
  /**
   * @param {{x: number, y: number}} pos
   * @param {{x: number, y: number}} vel
   */
  constructor(pos, vel = { x: 200, y: 50 }, radius = 10, color = "red") {
    this.pos = { ...pos };
    this.prevPos = { ...pos };
    this.vel = { ...vel };
    this.radius = radius;
    this.color = color;
  }

  getRenderPos(alpha) {
    return {
      x: lerp(this.prevPos.x, this.pos.x, alpha),
      y: lerp(this.prevPos.y, this.pos.y, alpha),
    };
  }

  beginPlay() {
    // add circle component
  }

  tick(deltaTime) {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
    this.pos.x += this.vel.x * deltaTime;
    this.pos.y += this.vel.y * deltaTime;

    this.checkWallCollision();
  }

  render(renderer, alpha) {
    renderer.drawCircle(this.getRenderPos(alpha), this.radius, this.color);
  }

  /**
   * @param {{x: number, y: number}} pos
   */
  teleport(pos) {
    this.pos.x = pos.x;
    this.pos.y = pos.y;
    this.prevPos.x = pos.x; // set prevPos to new pos to keep from
    this.prevPos.y = pos.y; // interpolating between the two next render()
  }

  serve(dir) {
    this.teleport({ x: CANVAS.WIDTH / 2, y: CANVAS.HEIGHT / 2 });

    // That also fits into GameMode once it's handling scoring.
    this.vel.x = dir * Math.abs(this.vel.x);
  }

  checkWallCollision() {
    // Ball.checkWallCollision
    if (this.pos.x + this.radius < 0) this.world.gameMode.onBallOut("left");
    if (this.pos.x - this.radius > CANVAS.WIDTH)
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
