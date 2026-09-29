export class Renderer {
  constructor(canvasID, size) {
    this.canvas = document.querySelector(canvasID);
    if (!this.canvas) throw new Error(`${canvasID} canvas not found`);

    this.ctx = this.canvas.getContext("2d");
    if (!this.ctx) throw new Error("canvas context not found");

    this.canvas.width = size.width;
    this.canvas.height = size.height;
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
}
