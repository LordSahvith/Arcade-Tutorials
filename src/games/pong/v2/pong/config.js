export const MARGINS = {
  XS: 15,
  SM: 20,
  MD: 40,
  LG: 80,
};

export const CANVAS = {
  WIDTH: 800,
  HEIGHT: 800 * (9 / 16),
};

export const GAME_DATA = {
  TICK_RATE: 60,
  MAX_FRAME_TIME: 0.25,
  MAX_SCORE: 7,
};

export const BALL = {
  pos: {
    x: CANVAS.WIDTH / 2,
    y: CANVAS.HEIGHT / 2,
  },
  vel: {
    x: 120,
    y: 120,
  },
  radius: 10,
  maxSpeed: 700,
  speedUp: 1.04,
  maxBounceAngle: Math.PI / 4, // 45° off a paddle edge
};

export const POWER_UP = {
  pos: {
    x: CANVAS.WIDTH / 2,
    y: -50,
  },
  vel: {
    x: 0,
    y: 0,
  },
  radius: 10,
  minSpeed: 200,
  maxSpeed: 400,
};

const PADDLE = {
  vel: {
    x: 0,
    y: 420,
  },
  SIZE: {
    WIDTH: 20,
    HEIGHT: 90,
  },
};

export const PADDLES = {
  LEFT: {
    pos: {
      x: MARGINS.XS,
      y: CANVAS.HEIGHT / 2 - PADDLE.SIZE.HEIGHT / 2,
    },
    vel: {
      x: PADDLE.vel.x,
      y: PADDLE.vel.y,
    },
    SIZE: {
      width: PADDLE.SIZE.WIDTH,
      height: PADDLE.SIZE.HEIGHT,
    },
  },
  RIGHT: {
    pos: {
      x: CANVAS.WIDTH - PADDLE.SIZE.WIDTH - MARGINS.XS,
      y: CANVAS.HEIGHT / 2 - PADDLE.SIZE.HEIGHT / 2,
    },
    vel: {
      x: PADDLE.vel.x,
      y: PADDLE.vel.y,
    },
    size: {
      width: PADDLE.SIZE.WIDTH,
      height: PADDLE.SIZE.HEIGHT,
    },
  },
};
