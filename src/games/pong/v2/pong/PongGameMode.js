import { GameMode } from '../engine/core/GameMode';
import { PlayerController } from './controllers/PlayerController';
import { AIController } from './controllers/AIController';
import { Court } from './actors/Court';
import { Paddle } from './actors/Paddle';
import { Ball } from './actors/Ball';
import { HUD } from './ui/HUD';
import { PauseScreen } from '../engine/core/screens/PauseScreen';
import { GameOverScreen } from '../engine/core/screens/GameOverScreen';
import { CANVAS, BALL, MARGINS, PADDLES, GAME_DATA } from './config';

export class PongGameMode extends GameMode {
  score = { left: 0, right: 0 };
  court = null;
  ball = null;
  paddles = [];
  hud = null;

  tick() {
    if (this.world.input.wasPressed('Escape')) {
      this.world.game.screens.push(new PauseScreen());
    }
  }

  beginPlay() {
    // Court
    this.court = this.world.spawn(
      new Court({ name: 'Court', pos: { x: CANVAS.WIDTH / 2, y: MARGINS.XS } })
    );

    // Paddles
    const paddleLeft = this.world.spawn(
      new Paddle({ name: 'Left Paddle', type: 'left', ...PADDLES.LEFT })
    );
    const paddleRight = this.world.spawn(
      new Paddle({ name: 'Right Paddle', type: 'right', ...PADDLES.RIGHT })
    );
    this.paddles = [paddleLeft, paddleRight];

    // Ball
    // PongGameMode
    this.ball = this.world.spawn(
      new Ball({ name: 'Game Ball', ...BALL, paddles: this.paddles })
    );

    // HUD
    this.hud = this.world.spawn(
      new HUD({ name: 'HUD', pos: { x: CANVAS.WIDTH / 2, y: 40 } })
    );

    // Controllers
    this.world.addController(new PlayerController()).possess(paddleLeft);
    this.world.addController(new AIController(this.ball)).possess(paddleRight);
  }

  onBallOut(side) {
    this.handleScore(side);
    this.bIsGameOver() ? this.onGameOver(side) : this.ballReset(side);
  }

  handleScore(side) {
    side === 'left' ? this.score.right++ : this.score.left++;
  }

  ballReset(side) {
    // serve toward the player who lost the point
    this.ball.serve(side === 'left' ? -1 : 1);
  }

  bIsGameOver() {
    return (
      this.score.left === GAME_DATA.MAX_SCORE ||
      this.score.right === GAME_DATA.MAX_SCORE
    );
  }

  onGameOver(side) {
    const winner = side === 'left' ? 'Right' : 'Left';
    this.world.game.screens.push(
      new GameOverScreen({
        heading: `${winner} player wins!`,
        lines: [`${this.score.left} - ${this.score.right}`],
      })
    );
  }
}
