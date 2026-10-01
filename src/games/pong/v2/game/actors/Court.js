// Net.js
import { Actor } from "./Actor";
import { CANVAS, MARGINS } from "../_data/data";

export class Court extends Actor {
  /**
   * @param {{x: number, y: number}} pos top of the net
   * @param {string} color
   */
  constructor(pos, color = "#a800a8") {
    super(pos, color);
    this.length = CANVAS.HEIGHT - pos.y * 2;
    this.dash = MARGINS.SM;
    this.gap = MARGINS.SM;
    this.lineWidth = 3;
  }

  drawCourt(renderer) {
    const grad = renderer.ctx.createRadialGradient(
      CANVAS.WIDTH / 2,
      CANVAS.HEIGHT / 2,
      300, // end inner circle
      CANVAS.WIDTH / 2,
      CANVAS.HEIGHT / 2,
      CANVAS.WIDTH, // end outer circle
    );

    grad.addColorStop(0, "black");
    grad.addColorStop(1, "#a800a8");

    renderer.drawRect(
      { x: 0, y: 0 },
      { width: CANVAS.WIDTH, height: CANVAS.HEIGHT },
      grad,
    );
  }

  drawNet(renderer) {
    const end = { x: this.pos.x, y: this.pos.y + this.length };
    renderer.drawLine(
      this.pos,
      end,
      this.dash,
      this.gap,
      this.lineWidth,
      this.color,
    );
  }

  render(renderer) {
    this.drawCourt(renderer);
    this.drawNet(renderer);
  }
}
