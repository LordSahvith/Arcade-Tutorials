import { Actor } from "./actors/Actor";

export class HUD extends Actor {
  /**
   * @param {{x: number, y: number}} pos
   * @param {string} color
   */
  constructor(pos, color = "white") {
    super(pos, color);
  }

  render(renderer) {
    const { left, right } = this.world.gameMode.score;
    renderer.drawText(
      this.pos,
      `${left} | ${right}`,
      "25px monospace",
      this.color,
      "center",
    );
  }
}
