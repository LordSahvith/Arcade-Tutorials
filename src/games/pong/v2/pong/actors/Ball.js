import { Actor } from '../../engine/core/actors/Actor';

export class Ball extends Actor {
  /**
   * @param {{x: number, y: number}} pos
   * @param {{x: number, y: number}} vel
   * @param {number} radius
   * @param {string} color
   */
  constructor(pos, vel = { x: 200, y: 50 }, radius = 10, color = 'red') {
    super(pos, color);
    this.vel = { ...vel };
    this.radius = radius;
  }

  beginPlay() {
    // TODO: add circle component
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
    this.teleport({
      x: this.world.renderer.width / 2,
      y: this.world.renderer.height / 2,
    });
    this.vel.x = dir * Math.abs(this.vel.x);
  }

  checkWallCollision() {
    // left / right: out of bounds, let GameMode score it
    if (this.pos.x + this.radius < 0) this.world.gameMode.onBallOut('left');
    if (this.pos.x - this.radius > this.world.renderer.width)
      this.world.gameMode.onBallOut('right');

    // top
    if (this.pos.y - this.radius < 0) {
      this.pos.y = this.radius; // nudge ball away
      this.vel.y = Math.abs(this.vel.y); // always down (+1)
    }

    // bottom
    if (this.pos.y + this.radius > this.world.renderer.height) {
      this.pos.y = this.world.renderer.height - this.radius; // nudge ball away
      this.vel.y = -Math.abs(this.vel.y); // always up (-1)
    }
  }
}
