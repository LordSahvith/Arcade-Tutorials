import { lerp } from '../math/math';

export class Actor {
  id = null;
  world = null;

  /**
   * Parameter objects should always be in lowercase
   * e.g. pos.x, not pos.X
   * @param {{x: number, y: number}} pos
   * @param {string} color
   */
  constructor(pos, color = 'white') {
    this.pos = { ...pos };
    this.prevPos = { ...pos };
    this.color = color;
  }

  beginPlay() {}

  /**
   * Saves prevPos for render interpolation. Subclasses that move must call
   * super.tick(deltaTime) before changing pos.
   */
  tick(deltaTime) {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  render(renderer, alpha) {}

  endPlay() {}

  getRenderPos(alpha) {
    return {
      x: lerp(this.prevPos.x, this.pos.x, alpha),
      y: lerp(this.prevPos.y, this.pos.y, alpha),
    };
  }

  /**
   * @param {{x: number, y: number}} pos
   */
  teleport(pos) {
    this.pos.x = pos.x;
    this.pos.y = pos.y;
    this.prevPos.x = pos.x; // set prevPos to new pos to keep from
    this.prevPos.y = pos.y; // interpolating between the two next render()
  }
}
