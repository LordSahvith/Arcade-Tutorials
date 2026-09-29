import { Renderer } from "./Renderer";
import { GameMode } from "./GameMode";
import { GAME } from "./data";

export class World {
  /**
   * @param {String} canvasID
   * @param {{width: number, height: number}} size
   */
  constructor(canvasID, size) {
    this.renderer = new Renderer(canvasID, size);
    this.gameMode = new GameMode(this);

    this.actors = [];
    this.nextId = 0;

    this.FIXED_DELTA_TIME = 1 / GAME.TICK_RATE;
    this.lastTime = performance.now();
    this.accumulator = 0;
  }

  spawn(obj) {
    obj.id = this.nextId++;
    obj.world = this;
    this.actors.push(obj);
    obj.beginPlay();

    return obj;
  }

  beginPlay() {
    this.gameMode.beginPlay();
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
    let deltaTime = (now - this.lastTime) / 1000;
    this.lastTime = now;

    if (deltaTime > GAME.MAX_FRAME_TIME) deltaTime = GAME.MAX_FRAME_TIME;

    this.accumulator += deltaTime;

    while (this.accumulator >= this.FIXED_DELTA_TIME) {
      this.tick(this.FIXED_DELTA_TIME);
      this.accumulator -= this.FIXED_DELTA_TIME;
    }

    const alpha = this.accumulator / this.FIXED_DELTA_TIME;
    this.render(alpha);

    requestAnimationFrame(this.update);
  };

  tick(deltaTime) {
    for (const actor of this.actors) actor.tick(deltaTime);
  }

  render(alpha = 1) {
    this.renderer.clear();
    for (const actor of this.actors) actor.render(this.renderer, alpha);
  }
}
