import { lerp } from '../../math/math';

export class Actor {
  id = null;
  world = null;
  components = [];
  bIsHidden = false;
  bShouldTick = true;

  /**
   * Parameter objects should always be in lowercase
   * e.g. pos.x, not pos.X
   * @param {{x: number, y: number}} pos
   * @param {string} color
   */
  constructor(name, pos, color = 'white') {
    this.name = name;
    this.pos = { ...pos };
    this.prevPos = { ...pos };
    this.startPos = { ...pos };
    this.color = color;
  }

  beginPlay() {
    for (const component of this.components) component.beginPlay();
  }

  /**
   * Saves prevPos for render interpolation.
   * Subclasses that move must call
   * super.tick(deltaTime) before changing pos.
   */
  tick(deltaTime) {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
    for (const component of this.components) component.tick(deltaTime);
  }

  render(renderer, alpha) {
    for (const component of this.components) component.render(renderer, alpha);
  }

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

  addComponent(component) {
    component.owner = this;
    this.components.push(component);
    return component;
  }
}
