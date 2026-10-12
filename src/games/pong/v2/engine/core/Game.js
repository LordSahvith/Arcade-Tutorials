import { Renderer } from '../renderer/Renderer';
import { WebInputManager } from '../input/WebInputManager';
import { ScreenManager } from './screens/ScreenManager';
import { GameScreen } from './screens/GameScreen';
export class Game {
  #accumulator = 0;
  #lastTime = performance.now();
  titleScreen = null;
  GameModeClass = null;

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

  startMatch(GameModeClass = this.GameModeClass) {
    if (!GameModeClass) throw new Error('startMatch: no game mode set');
    this.GameModeClass = GameModeClass; // so "play again" restarts the same mode
    this.screens.set(new GameScreen(GameModeClass));
  }

  showTitle() {
    this.screens.set(this.titleScreen);
  }

  setTitleScreen(screen) {
    this.titleScreen = screen;
  }

  run() {
    this.input.attach(window, this.renderer.canvas);
    this.showTitle();
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
