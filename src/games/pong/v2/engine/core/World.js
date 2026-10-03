export class World {
  /**
   * @param {Game} game
   * @param {GameMode} GameModeClass
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
    this.input.attach(window, this.renderer.canvas);
    this.gameMode.beginPlay();
  }

  tick(deltaTime) {
    for (const actor of this.actors) actor.tick(deltaTime);
    this.input.endTick();
  }

  render(alpha = 1) {
    this.renderer.clear();
    for (const actor of this.actors) actor.render(this.renderer, alpha);
  }

  spawn(obj) {
    obj.id = this.nextId++;
    obj.world = this;
    this.actors.push(obj);
    obj.beginPlay();

    return obj;
  }
}
