export class Controller {
  world = null;
  #possesed = null;

  constructor(world) {
    this.world = world;
  }

  beginPlay() {
    console.log('controller');
  }

  tick(deltaTime) {
    if (!this.#possesed) return;

    // this.produceCommand();
  }

  possess(actor) {
    this.#possesed = actor;
  }

  produceCommand() {
    console.log('command');
  }
}
