export class World {
  /**
   * @param {Game} game
   * @param {typeof GameMode} GameModeClass
   */
  constructor(game, GameModeClass) {
    this.game = game;
    this.renderer = game.renderer;
    this.input = game.input;
    this.gameMode = new GameModeClass(this);
    this.actors = [];
    this.nextId = 0;
  }

  beginPlay() {
    this.gameMode.beginPlay();
  }

  tick(deltaTime) {
    for (const actor of this.actors) actor.tick(deltaTime);
  }

  render(alpha = 1) {
    this.renderer.clear();
    for (const actor of this.actors) actor.render(this.renderer, alpha);
  }

  spawn(actor) {
    actor.id = this.nextId++;
    actor.world = this;
    this.actors.push(actor);
    actor.beginPlay();

    return actor;
  }
}
