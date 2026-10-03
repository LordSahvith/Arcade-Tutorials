export class Renderer {
  /**
   * @param {String} canvasID
   * @param {{width: number, height: number}} size
   */
  constructor(canvasID, size) {
    this.canvas = document.querySelector(canvasID);
    if (!this.canvas) throw new Error(`${canvasID} canvas not found`);

    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) throw new Error('canvas context not found');

    this.canvas.width = size.width;
    this.canvas.height = size.height;
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  clear(color = 'black') {
    this.drawRect(
      { x: 0, y: 0 },
      { width: this.width, height: this.height },
      color
    );
  }

  drawRect(
    pos = { x: 0, y: 0 },
    size = { width: 0, height: 0 },
    color = 'black'
  ) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(pos.x, pos.y, size.width, size.height);
  }

  drawCircle(pos = { x: 0, y: 0 }, radius = 10, color = 'black') {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawText(pos, text, font, color, align) {
    this.ctx.save();
    this.ctx.font = font;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = align;
    this.ctx.fillText(text, pos.x, pos.y);
    this.ctx.restore();
  }

  drawLine(start, end, dash, gap, lineWidth, color) {
    this.ctx.save();
    // Start a new path
    this.ctx.beginPath();
    this.ctx.setLineDash([dash, gap]);
    // Move to the start point
    this.ctx.moveTo(start.x, start.y);
    // Draw a line to the end point
    this.ctx.lineTo(end.x, end.y);
    // Set line style
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = color;
    // Draw the path
    this.ctx.stroke();
    this.ctx.restore();
  }
}
