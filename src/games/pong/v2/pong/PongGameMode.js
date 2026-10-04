import { GameMode } from '../engine/core/GameMode';
import { PlayerController } from './controllers/PlayerController';
import { AIController } from './controllers/AIController';
import { Court } from './actors/Court';
import { Paddle } from './actors/Paddle';
import { Ball } from './actors/Ball';
import { HUD } from './ui/HUD';
import { CANVAS, BALL, MARGINS, PADDLES, GAME_DATA } from './config';

export class PongGameMode extends GameMode {
  score = { left: 0, right: 0 };
  court = null;
  ball = null;
  paddles = [];
  hud = null;

  beginPlay() {
    // Court
    this.court = this.world.spawn(
      new Court({ x: CANVAS.WIDTH / 2, y: MARGINS.XS })
    );

    // Paddles
    const paddleLeft = this.world.spawn(new Paddle(PADDLES.LEFT));
    const paddleRight = this.world.spawn(new Paddle(PADDLES.RIGHT));
    this.paddles = [paddleLeft, paddleRight];

    // Ball
    // PongGameMode
    this.ball = this.world.spawn(new Ball({ ...BALL, paddles: this.paddles }));

    // HUD
    this.hud = this.world.spawn(new HUD({ x: CANVAS.WIDTH / 2, y: 40 }));

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
    console.log('winner:', side === 'left' ? 'right paddle' : 'left paddle');

    this.score = {
      left: 0,
      right: 0,
    };

    this.ballReset(side);
  }
}
