export class Controller {
  world = null;
  #possessed = null;

  beginPlay() {}

  tick(deltaTime) {
    const pawn = this.#possessed;

    if (!pawn) return;

    for (const command of this.produceCommands()) {
      command.execute(pawn);
    }
  }

  possess(pawn) {
    this.#possessed = pawn;
  }

  produceCommands() {
    return [];
  }
}
