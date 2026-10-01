/**
 * All constants should be in form:
 *
 * OBJ.PROP.VALUE (e.g. PADDLE.POS.X)
 *
 * then objs that aren't constants
 * should be in form:
 *
 * OBJ.PROP.value (PADDLES.LEFT.POS.x)
 *
 */
export const MARGINS = {
  XS: 15,
  SM: 20,
  MD: 40,
  LG: 80,
};

export const CANVAS = {
  WIDTH: 800,
  HEIGHT: 600,
};

export const GAME = {
  TICK_RATE: 60,
  MAX_FRAME_TIME: 0.25,
  MAX_SCORE: 2,
};

export const BALL = {
  POS: {
    X: CANVAS.WIDTH / 2,
    Y: CANVAS.HEIGHT / 2,
  },
  VEL: {
    X: 100,
    Y: 100,
  },
  RADIUS: 10,
};

const PADDLE = {
  VEL: {
    X: 0,
    Y: 420,
  },
  SIZE: {
    WIDTH: 20,
    HEIGHT: 90,
  },
};

export const PADDLES = {
  LEFT: {
    POS: {
      x: MARGINS.XS,
      y: CANVAS.HEIGHT / 2 - PADDLE.SIZE.HEIGHT / 2,
    },
    VEL: {
      x: PADDLE.VEL.X,
      y: PADDLE.VEL.Y,
    },
    SIZE: {
      width: PADDLE.SIZE.WIDTH,
      height: PADDLE.SIZE.HEIGHT,
    },
  },
  RIGHT: {
    POS: {
      x: CANVAS.WIDTH - PADDLE.SIZE.WIDTH - MARGINS.XS,
      y: CANVAS.HEIGHT / 2 - PADDLE.SIZE.HEIGHT / 2,
    },
    VEL: {
      x: PADDLE.VEL.X,
      y: PADDLE.VEL.Y,
    },
    SIZE: {
      width: PADDLE.SIZE.WIDTH,
      height: PADDLE.SIZE.HEIGHT,
    },
  },
};
