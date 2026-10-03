import { Controller } from '../../engine/core/Controller';

export class PlayerController extends Controller {
  produceCommands() {
    const y = this.world.input.axis(['KeyW', 'ArrowUp'], ['KeyS', 'ArrowDown']);
    return y ? [{ type: 'move', x: 0, y }] : [];
  }
}
