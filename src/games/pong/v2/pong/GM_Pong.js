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
import { randomSign } from '../engine/math/math';

export class GM_Pong extends GameMode {
  score = { left: 0, right: 0 };
  court = null;
  ball = null;
  paddles = [];
  hud = null;

  beginPlay() {
    // Court
    this.court = this.world.spawn(
      new Court({ name: 'Court', pos: { x: CANVAS.WIDTH / 2, y: MARGINS.XS } })
    );

    // Paddles
    this.paddles.push(
      this.world.spawn(
        new Paddle({ name: 'Left Paddle', type: 'left', ...PADDLES.LEFT })
      )
    );
    this.paddles.push(
      this.world.spawn(
        new Paddle({ name: 'Right Paddle', type: 'right', ...PADDLES.RIGHT })
      )
    );

    // Ball
    this.ball = this.world.spawn(
      new Ball({ name: 'Game Ball', ...BALL, paddles: this.paddles })
    );

    // HUD
    this.hud = this.world.spawn(
      new HUD({ name: 'HUD', pos: { x: CANVAS.WIDTH / 2, y: 40 } })
    );

    // Controllers
    this.world.addController(new PlayerController()).possess(this.paddles[0]);
    this.world
      .addController(new AIController(this.ball, this.powerUps))
      .possess(this.paddles[1]);

    const dir = {
      x: randomSign(),
      y: randomSign(),
    };
    this.ball.serve(dir);
  }

  tick() {
    if (this.world.input.wasPressed('Escape')) {
      this.world.game.screens.push(new PauseScreen());
    }
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
    const dir = {
      x: side === 'left' ? -1 : 1,
      y: randomSign(),
    };
    this.ball.serve(dir);
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
