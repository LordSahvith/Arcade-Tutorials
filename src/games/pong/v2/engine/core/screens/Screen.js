export class Screen {
  game = null; // set by ScreenManager
  bBlocksTick = true; // screens underneath stop updating
  bBlocksRender = true; // screens underneath aren't drawn

  enter() {}
  exit() {}
  tick(deltaTime) {}
  render(renderer, alpha) {}
}
