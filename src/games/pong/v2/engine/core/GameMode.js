export class GameMode {
  constructor(world) {
    this.world = world;
  }

  beginPlay() {}

  tick(deltaTime) {}

  bIsGameOver() {
    return false;
  }

  gameSummary() {}
}
