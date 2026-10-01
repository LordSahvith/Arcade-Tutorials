import { Renderer } from "./game/Renderer";
import { World } from "./game/World";
import { WebInputManager } from "./game/WebInputManager";
import { CANVAS } from "./game/data";
import { Game } from "./game/game";

const gameData = {
  canvasId: "#gameCanvas",
  canvasSize: {
    width: CANVAS.WIDTH,
    height: CANVAS.HEIGHT,
  },
};

function createRenderer() {
  const renderer = new Renderer(gameData.canvasId, gameData.canvasSize);
  if (!renderer) throw new Error("Renderer Not Found");
  return renderer;
}

function createInput() {
  const input = new WebInputManager();
  if (!input) throw new Error("Input Not Found");
  return input;
}

function runGame() {
  const renderer = createRenderer();
  const input = createInput();

  const game = new World(renderer, input);
  game.beginPlay();
}

/**
 * type="module" scripts run once the HTML is parsed, so runGame() could be
 * called directly. window.onload also waits for images and fonts to finish.
 */
window.onload = runGame;

// const game = new Game();
// game.createRenderer(gameData.canvasId, gameData.canvasSize);
// game.createInput();
// game.input.attach(window, game.renderer.canvas);
// window.onload = game.run;
