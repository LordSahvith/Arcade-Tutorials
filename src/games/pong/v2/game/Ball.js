export class Ball {
  constructor(
    pos = { x: 0, y: 0 },
    vel = { x: 50, y: 50 },
    radius = 10,
    color = "red",
  ) {
    this.pos = pos;
    this.prevPos = pos;
    this.vel = vel;
    this.radius = radius;
    this.color = color;
  }

  beginPlay() {
    // add circle component
  }

  endPlay() {}

  update(deltaTime) {
    this.pos.x += this.vel.x * deltaTime;
    this.pos.y += this.vel.y * deltaTime;
  }

  destroy() {}
}
