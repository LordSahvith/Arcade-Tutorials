export class Controller {
  world = null;
  #possessed = null;

  get pawn() {
    return this.#possessed;
  }

  beginPlay() {}

  tick(deltaTime) {
    const pawn = this.#possessed;

    if (!pawn) return;

    for (const command of this.produceCommands()) {
      this.world.commands.record(this.world.tickCount, pawn.id, command);
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
