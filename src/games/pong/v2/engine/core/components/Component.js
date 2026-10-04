export class Component {
  owner = null; // set by Actor.addComponent

  beginPlay() {}
  tick(deltaTime) {}
  render(renderer, alpha) {}
}
