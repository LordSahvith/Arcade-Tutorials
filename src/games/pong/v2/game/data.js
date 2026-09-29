export const CANVAS = {
  WIDTH: 800,
  HEIGHT: 600,
  MARGINS: {
    xs: 15,
    sm: 20,
    md: 40,
    lg: 80,
  },
};

export const GAME = {
  TICK_RATE: 60,
  MAX_FRAME_TIME: 0.25,
};

export const BALL = {
  POS: {
    x: CANVAS.WIDTH / 2,
    y: CANVAS.HEIGHT / 2,
  },
  VEL: {
    x: 100,
    y: 100,
  },
  RADIUS: 10,
};
