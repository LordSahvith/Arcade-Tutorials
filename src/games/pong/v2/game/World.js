import { Renderer } from "./Renderer";
import { GAME_DATA } from "./data";
import { Ball } from "./Ball";

export class World {
  constructor(canvasID, size = { width: 800, height: 600 }) {
    this.renderer = new Renderer(canvasID, size);
    this.actors = [];
    this.FIXED_DELTA_TIME = 1 / GAME_DATA.GAME.TICK_RATE;
    this.lastTime = performance.now();
    this.accumulator = 0;
    this.deltaTime = 0;

    this.ball = new Ball(
      GAME_DATA.BALL.POS,
      GAME_DATA.BALL.VEL,
      GAME_DATA.BALL.RADIUS,
    );
  }

  beginPlay() {
    requestAnimationFrame(this.update);
  }

  /**
   * Controls the frame update of the game. Uses an arrow
   * function to bind `this` (World) to the update method
   * so it'll always use this World's update().
   * `now` gets passed in from requestAnimationFrame().
   *
   * @param {number} now current timestamp
   */
  update = (now) => {
    this.deltaTime = (now - this.lastTime) / 1000;
    this.lastTime = now;

    if (this.deltaTime > GAME_DATA.GAME.MAX_FRAME_TIME)
      this.deltaTime = GAME_DATA.GAME.MAX_FRAME_TIME;

    this.accumulator += this.deltaTime;
    while (this.accumulator >= this.FIXED_DELTA_TIME) {
      this.tick();
      this.accumulator -= this.FIXED_DELTA_TIME;
    }

    const alpha = this.accumulator / this.FIXED_DELTA_TIME;
    this.render(alpha);
    requestAnimationFrame(this.update);
  };

  tick() {
    this.ball.update(this.FIXED_DELTA_TIME);
  }

  render(alpha = 1) {
    this.renderer.clear();
    this.renderer.drawCircle(this.ball.pos, this.ball.radius, this.ball.color);
  }
}
