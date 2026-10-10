import { Controller } from '../../engine/core/Controller';
import { MoveCommand } from '../../engine/core/commands/MoveCommand';

export class AIController extends Controller {
  /**
   * @param {Ball} ball the ball to track
   * @param {number} deadZone fraction of paddle height where the AI doesn't move
   */
  constructor(ball, powerUps, deadZone = 0.25) {
    super();
    this.ball = ball;
    this.powerUps = powerUps;
    this.deadZone = deadZone;
  }

  produceCommands() {
    const paddle = this.pawn;
    const paddleCenter = paddle.pos.y + paddle.size.height / 2;
    const bBallTowardsPaddle = this.ball.vel.x > 0;

    // default: drift back toward the ball
    let targetY = this.ball.pos.y;

    if (bBallTowardsPaddle) {
      targetY = this.ball.pos.y;
    } else {
      const visible = this.powerUps.find(p => !p.bIsHidden);
      if (visible) targetY = visible.pos.y;
    }

    const diff = targetY - paddleCenter;

    // close enough: don't move (stops jitter and lets the AI miss sometimes)
    if (Math.abs(diff) < paddle.size.height * this.deadZone) return [];

    return [new MoveCommand(0, Math.sign(diff))];
  }
}
