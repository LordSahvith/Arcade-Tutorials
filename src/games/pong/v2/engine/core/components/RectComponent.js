import { Component } from './Component';

export class RectComponent extends Component {
  constructor(size, color) {
    super();
    this.size = size;
    this.color = color;
  }

  render(renderer, alpha) {
    renderer.drawRect(this.owner.getRenderPos(alpha), this.size, this.color);
  }
}
