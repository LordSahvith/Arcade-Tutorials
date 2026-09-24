let canvas;
let ctx;

const CONSTANTS = {
  canvas: {
    size: {
      width: 800,
      height: 800 * 0.5625, // 16:9 ratio
    },
    margins: {
      xs: 15,
      sm: 20,
      md: 40,
      lg: 80,
    },
  },
  GAME: {
    TICK_RATE: 60,
    MAX_FRAME_TIME: 0.25,
  },
  ball: {
    vel: {
      x: 5,
      y: 1,
    },
  },
  paddle: {
    vel: {
      x: 0,
      y: 25,
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
  vel: { ...CONSTANTS.ball.vel },
  radius: 10,
  maxBounceAngle: Math.PI / 4, // 45° off a paddle edge
  speedUp: 1.04,
  maxSpeed: 900,
};

const paddle1 = {
  pos: {
    x: CONSTANTS.canvas.margins.md,
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
      CONSTANTS.canvas.margins.md,
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

function startGame() {
  canvas = requireCanvas();
  ctx = requireRenderingContext(canvas);

  canvas.addEventListener("mousemove", updatePaddlePos);
  document.addEventListener("keydown", movePaddle);

  serveBall(getRandServeDirection());

  requestAnimationFrame(update);
}

function update(now) {
  let deltaTime = (now - lastTime) / 1000;
  lastTime = now;
  if (deltaTime > CONSTANTS.GAME.MAX_FRAME_TIME)
    deltaTime = CONSTANTS.GAME.MAX_FRAME_TIME;

  accumulator += deltaTime;
  while (accumulator >= FIXED_DELTA_TIME) {
    updateAll();
    accumulator -= FIXED_DELTA_TIME;
  }
  drawAll();

  requestAnimationFrame(update);
}

function updateAll() {
  moveAll();

  if (score.player1 === 7 || score.player2 === 7) {
    console.log("game over!");

    score.player1 = 0;
    score.player2 = 0;

    serveBall(getRandServeDirection());
  }
}

function drawAll() {
  drawCourt();
  drawNet();
  drawCircle(ball.pos, ball.radius, "#a800a8");
  drawRect(paddle1.pos, paddle1.size, "#d40000");
  drawRect(paddle2.pos, paddle2.size, "#d40000");

  drawScore();
}

function moveAll() {
  wallCollision();
  paddleAI(paddle2);
  paddleCollision(paddle1);
  paddleCollision(paddle2, false);
  ball.pos.x += ball.vel.x;
  ball.pos.y += ball.vel.y;
}

function requireCanvas() {
  const canvas = document.querySelector("#gameCanvas");
  if (!canvas) throw new Error("#gameCanvas canvas not found");

  canvas.width = CONSTANTS.canvas.size.width;
  canvas.height = CONSTANTS.canvas.size.height;

  return canvas;
}

function requireRenderingContext(canvas) {
  const canvasRenderingContext = canvas.getContext("2d");
  if (!canvasRenderingContext) throw new Error("canvas context not found");
  return canvasRenderingContext;
}

function randRange(min = 0, max = 1) {
  return Math.random() * (max - min) + min;
}

function getRandServeDirection() {
  return randRange() < 0.5;
}

function getRandServeLocation() {
  return randRange(
    CONSTANTS.canvas.margins.lg,
    canvas.height - CONSTANTS.canvas.margins.lg,
  );
}

function paddleAI(paddle) {
  const paddleCenter = paddle.pos.y + paddle.size.height / 2;
  const ballCenter = ball.pos.y + ball.radius;
  const diff = ballCenter - paddleCenter;

  if (Math.abs(diff) < paddle.size.height / 4) return;
  paddle.pos.y += diff > 0 ? paddle.vel.y : -paddle.vel.y;
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
 * Checks if ball and paddle are overlapping
 *
 * @param {*} paddle
 * @param {*} ball
 * @returns {Boolean}
 */
function overlap(paddle, ball) {
  return (
    paddle.pos.x < ball.pos.x + ball.radius &&
    paddle.pos.x + paddle.size.width > ball.pos.x - ball.radius &&
    paddle.pos.y < ball.pos.y + ball.radius &&
    paddle.pos.y + paddle.size.height > ball.pos.y - ball.radius
  );
}

/**
 * Handles collision between paddle and ball.
 *
 * @param {*} paddle
 * @param {Boolean} bIsLeft
 */
function paddleCollision(paddle, bIsLeft = true) {
  if (overlap(paddle, ball)) {
    const paddleCenterY = paddle.pos.y + paddle.size.height / 2;
    const offset = Math.max(
      -1,
      Math.min(
        (ball.pos.y + ball.radius - paddleCenterY) / (paddle.size.height / 2),
        1,
      ),
    );
    const angle = offset * ball.maxBounceAngle;
    const speed = Math.min(
      Math.hypot(ball.vel.x, ball.vel.y) * ball.speedUp,
      ball.maxSpeed,
    );

    bIsLeft ? (ball.pos.x += 1) : (ball.pos.x -= 1); // nudge ball away
    const dir = bIsLeft ? 1 : -1;
    ball.vel = {
      x: Math.sign(dir) * speed * Math.cos(angle),
      y: speed * Math.sin(angle),
    };
  }

  // paddle stops at top of canvas
  if (paddle.pos.y <= 0) {
    paddle.pos.y = 0;
  }

  // paddle stops at bottom of canvas
  if (paddle.pos.y + paddle.size.height >= canvas.height) {
    paddle.pos.y = canvas.height - paddle.size.height;
  }
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
    ball.pos.y += 1; // nudge ball away
    ball.vel.y *= -1;
  }

  // bottom
  if (ball.pos.y + ball.radius > canvas.height) {
    ball.pos.y -= 1; // nudge ball away
    ball.vel.y *= -1;
  }
}

function drawCourt() {
  const grad = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    300, // end inner circle
    canvas.width / 2,
    canvas.height / 2,
    canvas.width, // end outer circle
  );

  grad.addColorStop(0, "black");
  grad.addColorStop(1, "#a800a8");

  ctx.fillStyle = grad;
  drawRect(
    { x: 0, y: 0 },
    { width: canvas.width, height: canvas.height },
    grad,
  );
}

function drawNet() {
  // Start a new path
  ctx.beginPath();
  ctx.setLineDash([CONSTANTS.canvas.margins.sm, CONSTANTS.canvas.margins.sm]); // 20px dash, 20px gap
  // Move to the start point
  ctx.moveTo(canvas.width / 2, CONSTANTS.canvas.margins.xs);
  // Draw a line to the end point
  ctx.lineTo(canvas.width / 2, canvas.height - CONSTANTS.canvas.margins.xs);
  // Set line style
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#a800a8";
  // Draw the path
  ctx.stroke();
}

function drawScore() {
  ctx.font = "25px monospace";
  ctx.fillStyle = "#eeeeee";
  ctx.textAlign = "center";
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
  color = "black",
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

function updatePaddlePos(event) {
  const pos = calculateMousePos(event);
  pos.x = paddle1.pos.x; // paddle should NOT move left/right on the x axis
  pos.y = pos.y - paddle1.size.height / 2;

  paddle1.pos = pos;
}

function movePaddle(event) {
  const code = event.code;
  if (code === "KeyW") {
    paddle1.pos.y -= paddle1.vel.y;
  } else if (code === "KeyS") {
    paddle1.pos.y += paddle1.vel.y;
  }
}

window.onload = startGame;
