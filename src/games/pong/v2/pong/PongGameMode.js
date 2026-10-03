import { GameMode } from '../engine/core/GameMode';
import { PlayerController } from './controllers/PlayerController';
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

    // Ball
    this.ball = this.world.spawn(
      new Ball(
        { x: BALL.POS.X, y: BALL.POS.Y },
        { x: BALL.VEL.X, y: BALL.VEL.Y },
        BALL.RADIUS
      )
    );

    // Paddles
    const paddleLeft = this.world.spawn(
      new Paddle(PADDLES.LEFT.POS, PADDLES.LEFT.VEL, PADDLES.LEFT.SIZE)
    );
    const paddleRight = this.world.spawn(
      new Paddle(PADDLES.RIGHT.POS, PADDLES.RIGHT.VEL, PADDLES.RIGHT.SIZE)
    );
    this.paddles = [paddleLeft, paddleRight];

    // HUD
    this.hud = this.world.spawn(new HUD({ x: CANVAS.WIDTH / 2, y: 40 }));

    // Controllers
    this.world.addController(new PlayerController()).possess(paddleLeft);
  }

  onBallOut(side) {
    this.handleScore(side);
    this.bIsGameOver() ? this.onGameOver(side) : this.ballReset(side);
  }

  handleScore(side) {
    if (side === 'left') this.score.right++;
    else this.score.left++;
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
