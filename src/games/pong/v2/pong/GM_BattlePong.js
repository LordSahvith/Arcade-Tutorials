import { POWER_UP } from './config';
import { ReverseXDirection } from './actors/powerUps/ReverseXDirection';
import { ReverseYDirection } from './actors/powerUps/ReverseYDirection';
import { GM_Pong } from './GM_Pong';

export class GM_BattlePong extends GM_Pong {
  powerUps = [];

  beginPlay() {
    super.beginPlay();

    // Powerups
    this.powerUps.push(
      this.world.spawn(
        new ReverseXDirection({
          name: 'Reverse X Direction',
          type: 'reverseX',
          ...POWER_UP,
          color: 'blue',
          paddles: this.paddles,
          ball: this.ball,
        })
      ),
      this.world.spawn(
        new ReverseYDirection({
          name: 'Reverse Y Direction',
          type: 'reverseY',
          ...POWER_UP,
          color: 'purple',
          paddles: this.paddles,
          ball: this.ball,
        })
      )
    );

    for (const powerUp of this.powerUps) {
      powerUp.spawnOnCourt();
    }
  }

  onPowerUpOut(powerUp) {
    powerUp.reset();
  }
}
