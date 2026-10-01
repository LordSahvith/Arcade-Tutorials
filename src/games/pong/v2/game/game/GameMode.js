import { CANVAS, BALL, MARGINS, PADDLES, GAME_DATA } from "../_data/data";
import { Court } from "../actors/Court";
import { Paddle } from "../actors/Paddle";
import { Ball } from "../actors/Ball";
import { HUD } from "../ui/HUD";

export class GameMode {
  constructor(world) {
    this.world = world;
    this.score = {
      left: 0,
      right: 0,
    };
  }

  beginPlay() {
    this.court = this.world.spawn(
      new Court({ x: CANVAS.WIDTH / 2, y: MARGINS.XS }),
    );
    this.ball = this.world.spawn(
      new Ball(
        { x: BALL.POS.X, y: BALL.POS.Y },
        { x: BALL.VEL.X, y: BALL.VEL.Y },
        BALL.RADIUS,
      ),
    );
    this.paddleLeft = this.world.spawn(
      new Paddle(PADDLES.LEFT.POS, PADDLES.LEFT.VEL, PADDLES.LEFT.SIZE),
    );
    this.paddleRight = this.world.spawn(
      new Paddle(PADDLES.RIGHT.POS, PADDLES.RIGHT.VEL, PADDLES.RIGHT.SIZE),
    );
    this.hud = this.world.spawn(new HUD({ x: CANVAS.WIDTH / 2, y: 40 }));
  }

  onBallOut(side) {
    this.handleScore(side);

    if (this.bIsGameOver()) {
      this.gameSummary(side);

      this.score = {
        left: 0,
        right: 0,
      };

      return;
    }

    this.ballReset(side);
  }

  handleScore(side) {
    if (side === "left") this.score.right++;
    else this.score.left++;
  }

  ballReset(side) {
    // serve toward the player who lost the point
    this.ball.serve(side === "left" ? -1 : 1);
  }

  bIsGameOver() {
    return (
      this.score.left === GAME_DATA.MAX_SCORE ||
      this.score.right === GAME_DATA.MAX_SCORE
    );
  }

  gameSummary(side) {
    console.log("winner:", side === "left" ? "right paddle" : "left paddle");

    this.ballReset(side);
  }
}
