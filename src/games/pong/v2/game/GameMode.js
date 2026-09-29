import { BALL } from "./data";
import { Ball } from "./Ball";

export class GameMode {
  constructor(world) {
    this.world = world;
    this.score = {
      left: 0,
      right: 0,
    };
  }

  beginPlay() {
    this.ball = this.world.spawn(new Ball(BALL.POS, BALL.VEL, BALL.RADIUS));
  }

  onBallOut(side) {
    if (side === "left") this.score.right++;
    else this.score.left++;

    // serve toward the player who lost the point
    this.ball.serve(side === "left" ? -1 : 1);
  }
}
