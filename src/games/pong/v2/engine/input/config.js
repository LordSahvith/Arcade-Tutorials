const BUTTON = {
  ARROW: {
    UP: 'ArrowUp',
    DOWN: 'ArrowDown',
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
  },
  KEY: {
    A: 'KeyA',
    D: 'KeyD',
    I: 'KeyI',
    J: 'KeyJ',
    K: 'KeyK',
    L: 'KeyL',
    P: 'KeyP',
    S: 'KeyS',
    W: 'KeyW',
    SEMICOLON: 'Semicolon',
    SPACE: 'Space',
    ENTER: 'Enter',
    ESCAPE: 'Escape',
    DIGIT1: 'Digit1',
    DIGIT2: 'Digit2',
    DIGIT3: 'Digit3',
    DIGIT4: 'Digit4',
  },
};

export const PREVENT_DEFAULT_KEYS = [
  BUTTON.ARROW.UP,
  BUTTON.ARROW.DOWN,
  BUTTON.KEY.SPACE,
  BUTTON.KEY.ENTER,
  BUTTON.KEY.ESCAPE,
];

export const DEFAULT_MENU_KEYS = {
  select: [BUTTON.KEY.ENTER, BUTTON.KEY.SPACE],
  back: [BUTTON.KEY.ESCAPE],
  up: [BUTTON.KEY.W, BUTTON.ARROW.UP],
  down: [BUTTON.KEY.S, BUTTON.ARROW.DOWN],
};

export const DEFAULT_GAME_KEYS = {
  select: [BUTTON.KEY.ENTER, BUTTON.KEY.SPACE],
  pause: [BUTTON.KEY.ESCAPE, BUTTON.KEY.P],
  back: [BUTTON.KEY.ESCAPE],
  up: [BUTTON.KEY.W, BUTTON.ARROW.UP],
  down: [BUTTON.KEY.S, BUTTON.ARROW.DOWN],
  left: [BUTTON.KEY.A, BUTTON.ARROW.LEFT],
  right: [BUTTON.KEY.D, BUTTON.ARROW.RIGHT],
};

export const DEFAULT_ACTION_KEYS = {
  jump: [BUTTON.KEY.SPACE],
  inventory: [BUTTON.KEY.I],
  action1: [BUTTON.KEY.J, BUTTON.KEY.DIGIT1],
  action2: [BUTTON.KEY.K, BUTTON.KEY.DIGIT2],
  action3: [BUTTON.KEY.L, BUTTON.KEY.DIGIT3],
  action4: [BUTTON.KEY.SEMICOLON, BUTTON.KEY.DIGIT4],
};
