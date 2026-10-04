import { Controller } from '../../engine/core/Controller';
import { MoveCommand } from '../../engine/core/commands/MoveCommand';

export class PlayerController extends Controller {
  produceCommands() {
    const y = this.world.input.axis(['KeyW', 'ArrowUp'], ['KeyS', 'ArrowDown']);
    return y ? [new MoveCommand(0, y)] : [];
  }
}
