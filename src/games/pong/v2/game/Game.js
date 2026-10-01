import { Renderer } from "./Renderer";
import { World } from "./World";
import { WebInputManager } from "./WebInputManager";

export class Game {
  createRenderer(canvasID, canvasSize) {
    this.renderer = new Renderer(canvasID, canvasSize);
    if (!this.renderer) throw new Error("Renderer Not Found");
  }

  createInput() {
    this.input = new WebInputManager();
    if (!this.input) throw new Error("Input Not Found");
  }

  run() {
    const game = new World(this.renderer, this.input);
    game.beginPlay();
  }
}
