import { PowerUp } from './PowerUp';

export class ReverseYDirection extends PowerUp {
  createEffect() {
    const ball = this.ball;
    return {
      type: this.type,
      name: this.name,
      activate: () => {
        ball.vel.y = -ball.vel.y;
      },
    };
  }
}
