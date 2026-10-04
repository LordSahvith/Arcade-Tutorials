/**
 * Collision is where components pay off.
 * CircleComponent and RectComponent can
 * each describe their own bounds, and a
 * shared circleVsRect(circle, rect)
 * function in the engine handles
 * ball–paddle collision for any actors
 * with those shapes. It's worth adding
 * the components and the collision code
 * together, so they get designed to fit
 * each other.
 */

export class Component {
  owner = null; // set by Actor.addComponent

  beginPlay() {}
  tick(deltaTime) {}
  render(renderer, alpha) {}
}
