import { Command } from '../../engine/core/commands/Command';

export class ReverseXCommand extends Command {
  type = 'reverseX';

  execute(pawn) {
    pawn.usePowerUp(this.type);
  }
}
