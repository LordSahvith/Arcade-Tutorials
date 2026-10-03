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

  applyCommand(command) {
    switch (command.type) {
      case 'move':
        this.inputX = command.x;
        this.inputY = command.y;
        break;
    }
  }

  applyMovement(deltaTime) {}
}
