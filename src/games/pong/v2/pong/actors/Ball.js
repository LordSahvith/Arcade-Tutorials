import { Actor } from '../../engine/core/actors/Actor';
import { CircleComponent } from '../../engine/core/components/CircleComponent';
import { lerp, clamp } from '../../engine/math/math';

export class Ball extends Actor {
  /**
   * @param {{x: number, y: number}} pos
   * @param {{x: number, y: number}} vel
   * @param {number} radius
   * @param {string} color
   * @param {Array typeof Paddle} paddles
   */
  constructor({
    name,
    pos,
    vel = { x: 200, y: 50 },
    radius = 10,
    color = 'red',
    maxSpeed = 700,
    speedUp = 1.04,
    maxBounceAngle = Math.PI / 4, // 45° off a paddle edge,
    paddles = [],
  }) {
    super(name, pos, color);
    this.vel = { ...vel };
    this.startVel = { ...vel };
    this.radius = radius;
    this.maxSpeed = maxSpeed;
    this.speedUp = speedUp;
    this.maxBounceAngle = maxBounceAngle;
    this.paddles = paddles;
  }

  beginPlay() {
    this.shape = this.addComponent(
      new CircleComponent(this.radius, this.color)
    );
    super.beginPlay();
  }

  tick(deltaTime) {
    super.tick(deltaTime);

    this.pos.x += this.vel.x * deltaTime;
    this.pos.y += this.vel.y * deltaTime;

    this.checkWallCollision();
    this.checkPaddleCollision();
  }

  /**
   * Serves from the center.
   *
   * @param {{x: -1 | 1, y: -1 | 1}} dir which way to send the ball on each axis
   */
  serve(dir) {
    const dirX = Math.sign(dir.x) || 1; // never 0: the ball must head toward a side
    const dirY = Math.sign(dir.y) || 1;
    this.teleport({
      x: this.world.renderer.width / 2,
      y: this.world.renderer.height / 2,
    });
    this.vel = {
      x: dirX * Math.abs(this.startVel.x),
      y: dirY * Math.abs(this.startVel.y),
    };
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

  checkPaddleCollision() {
    for (const paddle of this.paddles) {
      const bIsLeft = paddle.type === 'left';

      // only bounce if moving toward this paddle
      const bIsMovingToward = bIsLeft ? this.vel.x < 0 : this.vel.x > 0;
      if (!bIsMovingToward) continue;

      // the paddle face the ball can hit, and the ball's leading edge
      const faceX = bIsLeft ? paddle.pos.x + paddle.size.width : paddle.pos.x;
      const edge = bIsLeft ? -this.radius : this.radius;
      const prevEdgeX = this.prevPos.x + edge;
      const currEdgeX = this.pos.x + edge;

      // did the leading edge cross the face this tick?
      const bHasCrossed = bIsLeft
        ? prevEdgeX >= faceX && currEdgeX <= faceX
        : prevEdgeX <= faceX && currEdgeX >= faceX;
      if (!bHasCrossed) continue;

      // where the ball was when it crossed
      const alpha = (faceX - prevEdgeX) / (currEdgeX - prevEdgeX);
      const hitY = lerp(this.prevPos.y, this.pos.y, alpha);

      // ranges overlap, not "fully inside"
      const bIsPaddleHit =
        hitY + this.radius > paddle.pos.y &&
        hitY - this.radius < paddle.pos.y + paddle.size.height;
      if (!bIsPaddleHit) continue;

      // flush against the face, heading away
      this.pos.x = faceX - edge;
      this.pos.y = hitY;

      const paddleCenterY = paddle.pos.y + paddle.size.height / 2;
      const offset = clamp(
        (hitY - paddleCenterY) / (paddle.size.height / 2),
        -1,
        1
      );

      const angle = offset * this.maxBounceAngle;
      const speed = Math.min(
        Math.hypot(this.vel.x, this.vel.y) * this.speedUp,
        this.maxSpeed
      );
      const dir = bIsLeft ? 1 : -1;
      this.vel = {
        x: dir * speed * Math.cos(angle),
        y: speed * Math.sin(angle),
      };

      break;
    }
  }
}
