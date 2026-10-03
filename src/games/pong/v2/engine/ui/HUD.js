import { Actor } from "../core/Actor";

export class HUD extends Actor {
  /**
   * @param {{x: number, y: number}} pos
   * @param {string} color
   */
  constructor(pos, color = "white") {
    super(pos, color);
  }

  render(renderer) {}
}
