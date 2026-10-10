import { Command } from '../../engine/core/commands/Command';

export class ReverseYCommand extends Command {
  type = 'reverseY';

  execute(pawn) {
    pawn.usePowerUp(this.type);
  }
}
