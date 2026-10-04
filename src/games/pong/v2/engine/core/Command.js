/**
 * An action a Controller asks its Pawn to perform. The Controller passes
 * the pawn in, so one command class works for any pawn.
 */
export class Command {
  /** @param {Pawn} pawn */
  execute(pawn) {}
}
