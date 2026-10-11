import { Pawn } from '../../engine/core/actors/Pawn';
import { RectComponent } from '../../engine/core/components/RectComponent';
import { clamp } from '../../engine/math/math';

export class Paddle extends Pawn {
  heldPowerUps = new Map();

  /**
   * @param {{x: number, y: number}} pos
   * @param {{x: number, y: number}} vel
   * @param {{width: number, height: number}} size
   * @param {string} color
   */
  constructor({ name, type, pos, vel, size, color = 'red' }) {
    super(name, pos, color);
    this.vel = { ...vel };
    this.size = { ...size };
    this.type = type;
  }

  beginPlay() {
    this.shape = this.addComponent(new RectComponent(this.size, this.color));
    super.beginPlay();
  }

  tick(deltaTime) {
    super.tick(deltaTime);
  }

  applyMovement(deltaTime) {
    const dir = clamp(this.inputY, -1, 1);
    this.pos.y += dir * this.vel.y * deltaTime;
    this.pos.y = clamp(
      this.pos.y,
      0,
      this.world.renderer.height - this.size.height
    );
  }

  addPowerUp(effect) {
    this.heldPowerUps.set(effect.type, effect);
  }

  usePowerUp(type) {
    const effect = this.heldPowerUps.get(type);
    console.log(this.heldPowerUps);
    if (!effect) return; // don't have that one
    effect.activate();
    this.heldPowerUps.delete(type);
  }
}
