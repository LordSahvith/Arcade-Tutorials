export class ScreenManager {
  stack = [];

  constructor(game) {
    this.game = game;
  }

  set(screen) {
    while (this.stack.length) this.pop();
    this.push(screen);
  }

  push(screen) {
    screen.game = this.game;
    this.stack.push(screen);
    screen.enter();
  }

  pop() {
    this.stack.pop()?.exit();
  }

  replace(screen) {
    this.pop();
    this.push(screen);
  }

  tick(deltaTime) {
    // copy the stack: screens may push/pop during their own tick
    const screens = [...this.stack];
    for (let i = screens.length - 1; i >= 0; i--) {
      const screen = screens[i];
      screen.tick(deltaTime);
      if (screen.bBlocksTick) break;
    }
  }

  render(alpha) {
    this.game.renderer.clear();
    if (!this.stack.length) return;

    // find the lowest screen that should be visible, then draw upward
    let start = this.stack.length - 1;
    while (start > 0 && !this.stack[start].bBlocksRender) start--;
    for (let i = start; i < this.stack.length; i++) {
      this.stack[i].render(this.game.renderer, alpha);
    }
  }
}
