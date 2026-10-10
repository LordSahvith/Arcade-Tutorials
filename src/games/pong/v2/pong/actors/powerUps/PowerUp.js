import { Actor } from '../../../engine/core/actors/Actor';
import { CircleComponent } from '../../../engine/core/components/CircleComponent';
import { getRandomInt, lerp } from '../../../engine/math/math';
import { CANVAS, MARGINS, POWER_UP } from '../../config';

export class PowerUp extends Actor {
  shape = null;

  /**
   * @param {{x: number, y: number}} pos
   * @param {{x: number, y: number}} vel
   * @param {number} radius
   * @param {string} color
   * @param {Array typeof Paddle} paddles
   */
  constructor({
    name,
    type,
    pos,
    vel = { x: 200, y: 50 },
    radius = 10,
    color = 'blue',
    minSpeed = 200,
    maxSpeed = 400,
    paddles = [],
    ball,
  }) {
    super(name, pos, color);
    this.vel = { ...vel };
    this.type = type;
    this.startVel = { ...vel };
    this.radius = radius;
    this.minSpeed = minSpeed;
    this.maxSpeed = maxSpeed;
    this.paddles = paddles;
    this.ball = ball;
  }

  beginPlay() {
    this.bIsHidden = true;
    this.shape = this.addComponent(
      new CircleComponent(this.radius, this.color)
    );
    super.beginPlay();
  }

  tick(deltaTime) {
    if (!this.bShouldTick || this.bIsHidden) return;
    super.tick(deltaTime);

    this.pos.x += this.vel.x * deltaTime;
    this.pos.y += this.vel.y * deltaTime;

    this.checkOutOfBounds();
    this.checkPaddleCollision();
  }

  checkOutOfBounds() {
    // left / right: out of bounds, let GameMode handle it
    if (
      this.pos.x + this.radius < 0 ||
      this.pos.x - this.radius > this.world.renderer.width
    )
      this.world.gameMode.onPowerUpOut(this);
  }

  spawnOnCourt() {
    this.teleport({
      x: CANVAS.WIDTH / 2,
      y: getRandomInt(MARGINS.MD, CANVAS.HEIGHT - MARGINS.MD),
    });
    this.vel.x = -getRandomInt(this.minSpeed, this.maxSpeed);
    this.bIsHidden = false;
    this.bShouldTick = true;
  }

  reset() {
    this.teleport(this.startPos);
    this.vel = { ...this.startVel };
    this.bIsHidden = true;
    this.bShouldTick = false;
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

      paddle.addPowerUp(this.createEffect());
      this.reset();

      break;
    }
  }

  createEffect() {}
}
