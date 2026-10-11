/**
 * An action a Controller asks its Pawn to perform. The Controller passes
 * the pawn in, so one command class works for any pawn.
 */
export class Command {
  type = null;

  /** @param {Pawn} pawn */
  execute(pawn) {}

  toJSON() {
    return { type: this.type, x: this.x, y: this.y };
  }
}
