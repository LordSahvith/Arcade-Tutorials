import { Component } from './Component';

export class CircleComponent extends Component {
  constructor(radius, color) {
    super();
    this.radius = radius;
    this.color = color;
  }

  render(renderer, alpha) {
    renderer.drawCircle(
      this.owner.getRenderPos(alpha),
      this.radius,
      this.color
    );
  }
}
