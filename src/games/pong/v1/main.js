let canvas;
let ctx;

const CONSTANTS = {
  canvas: {
    size: {
      width: 800,
      height: 800 * (9 / 16), // 16:9 ratio
    },
    margins: {
      XS: 15,
      SM: 20,
      MD: 40,
      LG: 80,
    },
  },
  GAME: {
    TICK_RATE: 60,
    MAX_FRAME_TIME: 0.25,
  },
  ball: {
    vel: {
      x: 300,
      y: 60,
    },
  },
  paddle: {
    vel: {
      x: 0,
      y: 420,
    },
    size: {
      width: 15,
      height: 90,
    },
  },
};

const ball = {
  pos: {
    x: 300,
    y: 400,
  },
  prevPos: {
    x: 300,
    y: 400,
  },
  vel: { ...CONSTANTS.ball.vel },
  radius: 10,
  maxBounceAngle: Math.PI / 4, // 45° off a paddle edge
  speedUp: 1.04,
  maxSpeed: 900,
};

const paddle1 = {
  pos: {
    x: CONSTANTS.canvas.margins.XS,
    y: CONSTANTS.canvas.size.height / 2 - CONSTANTS.paddle.size.height / 2,
  },
  prevPos: {
    x: CONSTANTS.canvas.margins.XS,
    y: CONSTANTS.canvas.size.height / 2 - CONSTANTS.paddle.size.height / 2,
  },
  vel: { ...CONSTANTS.paddle.vel },
  size: { ...CONSTANTS.paddle.size },
};

const paddle2 = {
  pos: {
    x:
      CONSTANTS.canvas.size.width -
      CONSTANTS.paddle.size.width -
      CONSTANTS.canvas.margins.XS,
    y: CONSTANTS.canvas.size.height / 2 - CONSTANTS.paddle.size.height / 2,
  },
  prevPos: {
    x:
      CONSTANTS.canvas.size.width -
      CONSTANTS.paddle.size.width -
      CONSTANTS.canvas.margins.XS,
    y: CONSTANTS.canvas.size.height / 2 - CONSTANTS.paddle.size.height / 2,
  },
  vel: { ...CONSTANTS.paddle.vel },
  size: { ...CONSTANTS.paddle.size },
};

const score = {
  player1: 0,
  player2: 0,
};

const FIXED_DELTA_TIME = 1 / CONSTANTS.GAME.TICK_RATE;
let lastTime = performance.now();
let accumulator = 0;
let deltaTime = 0;

const keys = {};

function startGame() {
  canvas = requireCanvas();
  ctx = requireRenderingContext(canvas);

  canvas.addEventListener('mousemove', updatePaddlePos);
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  // clear held keys if the window loses focus, otherwise the paddle keeps moving
  window.addEventListener('blur', () => {
    for (const code in keys) keys[code] = false;
  });

  serveBall(getRandServeDirection());

  requestAnimationFrame(update);
}

function update(now) {
  deltaTime = (now - lastTime) / 1000;
  lastTime = now;
  if (deltaTime > CONSTANTS.GAME.MAX_FRAME_TIME)
    deltaTime = CONSTANTS.GAME.MAX_FRAME_TIME;

  accumulator += deltaTime;
  while (accumulator >= FIXED_DELTA_TIME) {
    updateAll();
    accumulator -= FIXED_DELTA_TIME;
  }
  const alpha = accumulator / FIXED_DELTA_TIME;
  drawAll(alpha);

  requestAnimationFrame(update);
}

function updateAll() {
  savePrevPositions();
  moveAll();

  if (score.player1 === 7 || score.player2 === 7) {
    console.log('game over!');

    score.player1 = 0;
    score.player2 = 0;

    serveBall(getRandServeDirection());
  }
}

function drawAll(alpha = 1) {
  drawCourt();
  drawNet();
  drawCircle(renderPos(ball, alpha), ball.radius, '#d40000');
  drawRect(renderPos(paddle1, alpha), paddle1.size, '#d40000');
  drawRect(renderPos(paddle2, alpha), paddle2.size, '#d40000');

  drawScore();
}

function drawCourt() {
  const grad = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    300, // end inner circle
    canvas.width / 2,
    canvas.height / 2,
    canvas.width // end outer circle
  );

  grad.addColorStop(0, 'black');
  grad.addColorStop(1, '#a800a8');

  ctx.fillStyle = grad;
  drawRect(
    { x: 0, y: 0 },
    { width: canvas.width, height: canvas.height },
    grad
  );
}

function drawNet() {
  // Start a new path
  ctx.beginPath();
  ctx.setLineDash([CONSTANTS.canvas.margins.SM, CONSTANTS.canvas.margins.SM]); // 20px dash, 20px gap
  // Move to the start point
  ctx.moveTo(canvas.width / 2, CONSTANTS.canvas.margins.XS);
  // Draw a line to the end point
  ctx.lineTo(canvas.width / 2, canvas.height - CONSTANTS.canvas.margins.XS);
  // Set line style
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#a800a8';
  // Draw the path
  ctx.stroke();
}

function drawScore() {
  ctx.font = '25px monospace';
  ctx.fillStyle = '#eeeeee';
  ctx.textAlign = 'center';
  ctx.fillText(`${score.player1}   ${score.player2}`, canvas.width / 2, 40);
}

/**
 * Creates a Rectangle
 *
 * @param {Object} pos
 * @param {Object} size
 * @param {String} color
 */
function drawRect(
  pos = { x: 0, y: 0 },
  size = { width: canvas.width, height: canvas.height },
  color = 'black'
) {
  ctx.fillStyle = color;
  ctx.fillRect(pos.x, pos.y, size.width, size.height);
}

/**
 * Creates a Circle
 *
 * @param {Object} pos
 * @param {Number} radius
 * @param {String} color
 */
function drawCircle(pos = { x: 0, y: 0 }, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function savePrevPositions() {
  for (const obj of [ball, paddle1, paddle2]) {
    // copy the values by assigning them directly,
    // do NOT assign a reference like so: obj.prevPos = obj.pos
    // either
    // obj.prevPos.x = obj.pos.x;
    // obj.prevPos.y = obj.pos.y;
    // or
    obj.prevPos = { ...obj.pos };
  }
}

function moveAll() {
  // move first
  movePlayerPaddle();
  paddleAI(paddle2);
  ball.pos.x += ball.vel.x * FIXED_DELTA_TIME;
  ball.pos.y += ball.vel.y * FIXED_DELTA_TIME;

  // then check collisions
  wallCollision();
  paddleCollision(paddle1);
  paddleCollision(paddle2, false);
}

function renderPos(obj, alpha) {
  return {
    x: lerp(obj.prevPos.x, obj.pos.x, alpha),
    y: lerp(obj.prevPos.y, obj.pos.y, alpha),
  };
}

function paddleAI(paddle) {
  const paddleCenter = paddle.pos.y + paddle.size.height / 2;
  const ballCenter = ball.pos.y;
  const diff = ballCenter - paddleCenter;

  // keeps AI from always hitting the ball
  if (Math.abs(diff) < paddle.size.height / 4) return;

  const direction = diff > 0 ? 1 : -1;
  const next = paddle.pos.y + direction * paddle.vel.y * FIXED_DELTA_TIME;
  paddle.pos.y = clamp(next, 0, canvas.height - paddle.size.height);
}

/**
 * Serves ball in center of court (x-axis) at a random location and direction
 * (up/down) on the y-axis. Passing true/false for bServeLeft decides direction
 * in the x-axis (left/right).
 *
 * @param {Boolean} bServeLeft
 */
function serveBall(bServeLeft) {
  ball.pos = {
    x: canvas.width / 2,
    y: getRandServeLocation(),
  };
  ball.prevPos = { ...ball.pos };

  if (bServeLeft) {
    ball.vel.x = -CONSTANTS.ball.vel.x;
  } else {
    ball.vel.x = CONSTANTS.ball.vel.x;
  }

  ball.vel.y = getRandServeDirection()
    ? -CONSTANTS.ball.vel.y
    : CONSTANTS.ball.vel.y;
}

/**
 * PHYSICS
 */

/**
 * Handles collision between paddle and ball. Checks whether the ball's
 * leading edge crossed the paddle's front face during this tick, so fast
 * balls can't pass through the paddle between ticks.
 *
 * @param {*} paddle
 * @param {Boolean} bIsLeft
 */
function paddleCollision(paddle, bIsLeft = true) {
  // ignore a ball already moving away (prevents repeat hits)
  const movingToward = bIsLeft ? ball.vel.x < 0 : ball.vel.x > 0;
  if (!movingToward) return;

  // the paddle face the ball can hit, and the offset to the ball's leading edge
  const faceX = bIsLeft ? paddle.pos.x + paddle.size.width : paddle.pos.x;
  const edge = bIsLeft ? -ball.radius : ball.radius;
  const prevEdgeX = ball.prevPos.x + edge;
  const currEdgeX = ball.pos.x + edge;

  // did the leading edge cross the face this tick?
  const crossed = bIsLeft
    ? prevEdgeX >= faceX && currEdgeX <= faceX
    : prevEdgeX <= faceX && currEdgeX >= faceX;
  if (!crossed) return;

  // how far through the tick (0-1) the crossing happened, and the ball's y then
  const alpha = (faceX - prevEdgeX) / (currEdgeX - prevEdgeX);
  const hitY = lerp(ball.prevPos.y, ball.pos.y, alpha);

  // ball passed above or below the paddle
  const hitPaddle = rangesOverlap(
    paddle.pos.y,
    paddle.pos.y + paddle.size.height,
    hitY - ball.radius,
    hitY + ball.radius
  );
  if (!hitPaddle) return;

  // place the ball flush against the face, where it hit
  ball.pos.x = faceX - edge;
  ball.pos.y = hitY;

  const paddleCenterY = paddle.pos.y + paddle.size.height / 2;
  const offset = clamp(
    (hitY - paddleCenterY) / (paddle.size.height / 2),
    -1,
    1
  );
  const angle = offset * ball.maxBounceAngle;
  const speed = Math.min(
    Math.hypot(ball.vel.x, ball.vel.y) * ball.speedUp,
    ball.maxSpeed
  );

  const dir = bIsLeft ? 1 : -1;
  ball.vel = {
    x: dir * speed * Math.cos(angle),
    y: speed * Math.sin(angle),
  };
}

function wallCollision() {
  // left
  if (ball.pos.x + ball.radius < 0) {
    score.player2++;
    serveBall(true);
  }

  // right
  if (ball.pos.x - ball.radius > canvas.width) {
    score.player1++;
    serveBall(false);
  }

  // top
  if (ball.pos.y - ball.radius < 0) {
    ball.pos.y = ball.radius; // nudge ball away
    ball.vel.y = Math.abs(ball.vel.y); // always down
  }

  // bottom
  if (ball.pos.y + ball.radius > canvas.height) {
    ball.pos.y = canvas.height - ball.radius; // nudge ball away
    ball.vel.y = -Math.abs(ball.vel.y); // always up
  }
}

function calculateMousePos(event) {
  let rect = canvas.getBoundingClientRect();
  let root = document.documentElement;

  let mouseX = event.clientX - rect.left - root.scrollLeft;
  let mouseY = event.clientY - rect.top - root.scrollTop;

  return {
    x: mouseX,
    y: mouseY,
  };
}

/**
 * INPUT
 */

function updatePaddlePos(event) {
  const pos = calculateMousePos(event);
  pos.x = paddle1.pos.x; // paddle should NOT move left/right on the x axis
  pos.y = clamp(
    pos.y - paddle1.size.height / 2,
    0,
    canvas.height - paddle1.size.height
  );

  paddle1.pos = pos;
}

function onKeyDown(event) {
  keys[event.code] = true;
}

function onKeyUp(event) {
  keys[event.code] = false;
}

/**
 * Moves the player's paddle based on held keys. Runs every fixed tick so
 * movement is smooth and independent of the OS key-repeat rate.
 */
function movePlayerPaddle() {
  let direction = 0;
  if (keys.KeyW) direction -= 1;
  if (keys.KeyS) direction += 1;

  // current pos + direction (up/down) * paddle speed * fixed delta time (every tick)
  const next = paddle1.pos.y + direction * paddle1.vel.y * FIXED_DELTA_TIME;
  paddle1.pos.y = clamp(next, 0, canvas.height - paddle1.size.height);
}

/**
 * HELPER FUNCTIONS
 */

function requireCanvas() {
  const canvas = document.querySelector('#gameCanvas');
  if (!canvas) throw new Error('#gameCanvas canvas not found');

  canvas.width = CONSTANTS.canvas.size.width;
  canvas.height = CONSTANTS.canvas.size.height;

  return canvas;
}

function requireRenderingContext(canvas) {
  const canvasRenderingContext = canvas.getContext('2d');
  if (!canvasRenderingContext) throw new Error('canvas context not found');
  return canvasRenderingContext;
}

/**
 * Checks if two 1D ranges [minA, maxA] and [minB, maxB] overlap
 *
 * @param {Number} minA
 * @param {Number} maxA
 * @param {Number} minB
 * @param {Number} maxB
 * @returns {Boolean}
 */
function rangesOverlap(minA, maxA, minB, maxB) {
  return minA < maxB && maxA > minB;
}

function lerp(valueA, valueB, alpha) {
  return valueA + (valueB - valueA) * alpha;
}

/**
 * Constrain `value` to the inclusive range [min, max].
 *
 * @param {Number} value
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
function clamp(value, min, max) {
  return value < min ? min : value > max ? max : value;
}

function randRange(min = 0, max = 1) {
  return Math.random() * (max - min) + min;
}

function getRandServeDirection() {
  return randRange() < 0.5;
}

function getRandServeLocation() {
  return randRange(
    CONSTANTS.canvas.margins.LG,
    canvas.height - CONSTANTS.canvas.margins.LG
  );
}

window.onload = startGame;
