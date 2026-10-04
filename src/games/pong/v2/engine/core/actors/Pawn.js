import { Actor } from './Actor';

export class Pawn extends Actor {
  inputX = 0;
  inputY = 0;

  tick(deltaTime) {
    super.tick(deltaTime);
    this.applyMovement(deltaTime);
    this.inputX = 0;
    this.inputY = 0;
  }

  /** Adds to this tick's movement input. Several calls add together. */
  addMovementInput(x, y) {
    this.inputX += x;
    this.inputY += y;
  }

  applyMovement(deltaTime) {}
}
