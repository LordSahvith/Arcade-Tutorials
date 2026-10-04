import { Command } from '../Command';

export class MoveCommand extends Command {
  /**
   * @param {number} x -1 left, 0 none, 1 right
   * @param {number} y -1 up, 0 none, 1 down
   */
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
  }

  execute(pawn) {
    pawn.addMovementInput(this.x, this.y);
  }
}
