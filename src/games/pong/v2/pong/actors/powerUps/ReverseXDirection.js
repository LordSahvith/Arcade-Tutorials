import { PowerUp } from './PowerUp';

export class ReverseXDirection extends PowerUp {
  createEffect() {
    const ball = this.ball;
    return {
      type: this.type,
      name: this.name,
      activate: () => {
        ball.vel.x = -ball.vel.x;
      },
    };
  }
}
