import { lerp } from "./lib/math";

export class Renderer {
  constructor(canvasID, dimensions = { width: 800, height: 600 }) {
    this.canvas = document.querySelector(canvasID);
    if (!this.canvas) throw new Error(`${canvasID} canvas not found`);

    this.ctx = this.canvas.getContext("2d");
    if (!this.ctx) throw new Error("canvas context not found");

    this.canvas.width = dimensions.width;
    this.canvas.height = dimensions.height;
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  clear(color = "black") {
    this.drawRect(
      { x: 0, y: 0 },
      { width: this.width, height: this.height },
      color,
    );
  }

  drawRect(
    pos = { x: 0, y: 0 },
    size = { width: 0, height: 0 },
    color = "black",
  ) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(pos.x, pos.y, size.width, size.height);
  }

  drawCircle(pos = { x: 0, y: 0 }, radius = 10, color = "black") {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  renderPos(obj, alpha) {
    return {
      x: lerp(obj.prevPos.x, obj.pos.x, alpha),
      y: lerp(obj.prevPos.y, obj.pos.y, alpha),
    };
  }

  render() {}
}
