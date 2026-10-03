import { HUD as HUDBase } from "../../engine/ui/HUD";

export class HUD extends HUDBase {
  /**
   * @param {{x: number, y: number}} pos
   * @param {string} color
   */
  constructor(pos, color = "white") {
    super(pos, color);
  }

  drawScore(renderer) {
    const { left, right } = this.world.gameMode.score;
    renderer.drawText(
      this.pos,
      `${left} | ${right}`,
      "25px monospace",
      this.color,
      "center",
    );
  }

  render(renderer) {
    this.drawScore(renderer);
  }
}
