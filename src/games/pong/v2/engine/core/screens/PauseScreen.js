import { MenuScreen } from './MenuScreen';

export class PauseScreen extends MenuScreen {
  bBlocksRender = false; // keep the frozen game visible underneath

  render(renderer, alpha) {
    renderer.drawRect(
      { x: 0, y: 0 },
      { width: renderer.width, height: renderer.height },
      'rgba(0, 0, 0, 0.5)'
    );
    super.render(renderer, alpha);
  }
}
