import { Renderer } from '../renderer/Renderer';
import { WebInputManager } from '../input/WebInputManager';
import { ScreenManager } from './screens/ScreenManager';
export class Game {
  #accumulator = 0;
  #lastTime = performance.now();

  constructor({
    canvasId,
    size,
    preventDefaultKeys,
    tickRate = 60,
    maxFrameTime = 0.25,
  }) {
    this.renderer = new Renderer(canvasId, size);
    this.input = new WebInputManager({ preventDefaultKeys });
    this.screens = new ScreenManager(this);

    this.FIXED_DELTA_TIME = 1 / tickRate;
    this.maxFrameTime = maxFrameTime;
  }

  run() {
    this.input.attach(window, this.renderer.canvas);
    requestAnimationFrame(this.loop);
  }

  loop = now => {
    let deltaTime = (now - this.#lastTime) / 1000;
    this.#lastTime = now;

    if (deltaTime > this.maxFrameTime) deltaTime = this.maxFrameTime;

    this.#accumulator += deltaTime;

    while (this.#accumulator >= this.FIXED_DELTA_TIME) {
      this.screens.tick(this.FIXED_DELTA_TIME);
      this.input.endTick();
      this.#accumulator -= this.FIXED_DELTA_TIME;
    }

    const alpha = this.#accumulator / this.FIXED_DELTA_TIME;
    this.screens.render(alpha);
    requestAnimationFrame(this.loop);
  };
}
