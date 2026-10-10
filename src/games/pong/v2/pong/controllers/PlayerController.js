import { Controller } from '../../engine/core/Controller';
import { MoveCommand } from '../../engine/core/commands/MoveCommand';
import { ReverseXCommand } from '../commands/ReverseXCommand';
import { ReverseYCommand } from '../commands/ReverseYCommand';

export class PlayerController extends Controller {
  produceCommands() {
    const commands = [];

    const moveY = this.world.input.axis(
      ['KeyW', 'ArrowUp'],
      ['KeyS', 'ArrowDown']
    );
    if (moveY) commands.push(new MoveCommand(0, moveY));

    if (this.world.input.wasPressed('KeyH'))
      commands.push(new ReverseXCommand());
    if (this.world.input.wasPressed('KeyJ'))
      commands.push(new ReverseYCommand());

    return commands;
  }
}
