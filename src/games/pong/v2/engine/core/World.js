export class World {
  #nextId = 0;
  actors = [];
  controllers = [];

  /**
   * @param {Game} game
   * @param {typeof GameMode} GameModeClass
   */
  constructor(game, GameModeClass) {
    this.game = game;
    this.renderer = game.renderer;
    this.input = game.input;
    this.gameMode = new GameModeClass(this);
  }

  beginPlay() {
    this.gameMode.beginPlay();
  }

  tick(deltaTime) {
    for (const controller of this.controllers) controller.tick(deltaTime);
    for (const actor of this.actors) actor.tick(deltaTime);
    this.gameMode?.tick(deltaTime);
  }

  render(alpha = 1) {
    this.renderer.clear();
    for (const actor of this.actors) actor.render(this.renderer, alpha);
  }

  spawn(actor) {
    actor.id = this.#nextId++;
    actor.world = this;
    this.actors.push(actor);
    actor.beginPlay();

    return actor;
  }

  addController(controller) {
    controller.world = this;

    this.controllers.push(controller);
    controller.beginPlay();

    return controller;
  }
}
