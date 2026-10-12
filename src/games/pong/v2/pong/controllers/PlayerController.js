import { Controller } from '../../engine/core/Controller';
import { MoveCommand } from '../../engine/core/commands/MoveCommand';
import { ReverseXCommand } from '../commands/ReverseXCommand';
import { ReverseYCommand } from '../commands/ReverseYCommand';

export class PlayerController extends Controller {
  produceCommands() {
    const commands = [];
    const { input } = this.world;

    const moveY = input.axis(input.gameKeys.up, input.gameKeys.down);
    if (moveY) commands.push(new MoveCommand(0, moveY));

    if (input.anyWasPressed(input.actionKeys.action1))
      commands.push(new ReverseXCommand());
    if (input.anyWasPressed(input.actionKeys.action2))
      commands.push(new ReverseYCommand());

    return commands;
  }
}
