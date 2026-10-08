import { World } from '../World';
import { Screen } from './Screen';

export class GameScreen extends Screen {
  constructor(GameModeClass) {
    super();
    this.GameModeClass = GameModeClass;
  }

  enter() {
    this.world = new World(this.game, this.GameModeClass);
    this.world.beginPlay();
  }

  tick(deltaTime) {
    this.world.tick(deltaTime);
  }

  render(renderer, alpha) {
    this.world.render(alpha);
  }
}
