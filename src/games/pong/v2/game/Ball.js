import { lerp } from "./lib/math";

export class Ball {
  constructor(
    pos = { x: 0, y: 0 },
    vel = { x: 50, y: 50 },
    radius = 10,
    color = "red",
  ) {
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

  endPlay() {}

  tick(deltaTime) {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
    this.pos.x += this.vel.x * deltaTime;
    this.pos.y += this.vel.y * deltaTime;
  }

  render(renderer, alpha) {
    renderer.drawCircle(this.getRenderPos(alpha), this.radius, this.color);
  }

  destroy() {}
}
