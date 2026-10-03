export class Controller {
  world = null;
  #possesed = null;

  constructor(world) {
    this.world = world;
  }

  beginPlay() {
    console.log('controller::beginPlay()');
  }

  tick(deltaTime) {
    this.produceCommand();
  }

  possess(actor) {
    this.#possesed = actor;
  }

  produceCommand() {
    const actor = this.#possesed;

    if (!actor) return;

    if (this.world.input.pressedKeys.has('KeyW')) {
      actor.move();
    }
  }
}
