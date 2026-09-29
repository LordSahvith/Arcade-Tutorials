class Ball {
  constructor(
    pos = { x: 0, y: 0 },
    vel = { x: 1, y: 1 },
    radius = 10,
    acceleration = 1.04,
    maxBounceAngle = Math.PI / 4,
    maxSpeed = 900,
  ) {
    this.pos = pos;
    this.vel = vel;
    this.radius = radius;
    this.acceleration = acceleration;
    this.maxBounceAngle = maxBounceAngle;
    this.maxSpeed = maxSpeed;
  }

  render() {
    drawCircle(this.pos, this.radius, "red");
  }
}

class Paddle {
  constructor(
    pos = { x: 0, y: 0 },
    vel = { x: 1, y: 1 },
    size = { width: 15, height: 90 },
    score = 0,
  ) {
    this.pos = pos;
    this.vel = vel;
    this.size = size;
    this.score = score;
  }

  beginPlay() {
    this.startPos = this.pos;
  }

  tick() {}

  render() {
    drawRect(this.pos, this.size, "red");
  }

  updatePaddlePos(event) {
    const pos = calculateMousePos(event);
    pos.x = this.startPos.x; // paddle should NOT move left/right on the x axis
    pos.y = pos.y - this.size.height / 2;

    this.pos = pos;
  }
}

class World {
  constructor() {}

  beginPlay() {
    this.ball = new Ball();
    this.leftPaddle = new Paddle({ x: 40, y: 0 });
    this.rightPaddle = new Paddle({ x: 745, y: 0 });
    this.paddles = [this.leftPaddle, this.rightPaddle];

    for (const paddle of this.paddles) {
      paddle.beginPlay();
    }

    // canvas.addEventListener("mousemove", this.leftPaddle.updatePaddlePos);
  }

  tick(deltaTime) {
    this.ball.pos.x += this.ball.vel.x;
    this.ball.pos.y += this.ball.vel.y;

    this.wallCollision();
  }

  render() {
    this.ball.render();
    for (const paddle of this.paddles) {
      paddle.render();
    }

    this.HUD();
  }

  HUD() {
    ctx.font = "25px monospace";
    ctx.fillStyle = "blue";
    ctx.textAlign = "center";
    ctx.fillText(
      `${this.leftPaddle.score} | ${this.rightPaddle.score}`,
      canvas.width / 2,
      40,
    );
  }

  ballReset() {
    this.ball.pos = {
      x: canvas.width / 2,
      y: canvas.height / 2,
    };
    this.ball.vel.x = 1;
    this.ball.vel.x *= -1;
  }

  wallCollision() {
    // left
    if (this.ball.pos.x < 0) {
      this.rightPaddle.score++;
      this.ballReset();
    }

    // right
    if (this.ball.pos.x > canvas.clientWidth) {
      this.leftPaddle.score++;
      this.ballReset();
    }

    // top
    if (this.ball.pos.y < 0) {
      this.ball.vel.y *= -1;
    }

    // bottom
    if (this.ball.pos.y > canvas.clientHeight) {
      this.ball.vel.y *= -1;
    }
  }
}

class Pong {
  constructor() {}

  beginPlay() {
    this.world = new World();
    this.world.beginPlay();
  }

  update(deltaTime) {
    this.world.tick(deltaTime);
  }

  render() {
    drawRect(); // clears screen
    this.world.render();
  }
}

function requireCanvas() {
  const canvas = document.querySelector("#gameCanvas");
  if (!canvas) throw new Error("#gameCanvas canvas not found");
  return canvas;
}

function requireContext() {
  const canvasContext = canvas.getContext("2d");
  if (!canvasContext) throw new Error("canvas context not found");
  return canvasContext;
}

const canvas = requireCanvas();
const ctx = requireContext();

function drawRect(
  pos = { x: 0, y: 0 },
  size = { width: canvas.clientWidth, height: canvas.clientHeight },
  color = "black",
) {
  ctx.fillStyle = color;
  ctx.fillRect(pos.x, pos.y, size.width, size.height);
}

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

  const pos = {
    x: mouseX,
    y: mouseY,
  };

  return pos;
}

const TICK_RATE = 60;
const FIXED_DELTA_TIME = 1 / TICK_RATE;
const MAX_FRAME_TIME = 0.25;
let lastTime = performance.now();
let accumulator = 0;

const pong = new Pong();
pong.beginPlay();

function update(now) {
  let deltaTime = (now - lastTime) / 1000;
  lastTime = now;
  if (deltaTime > MAX_FRAME_TIME) deltaTime = MAX_FRAME_TIME;

  accumulator += deltaTime;
  while (accumulator >= FIXED_DELTA_TIME) {
    pong.update(deltaTime);
    accumulator -= FIXED_DELTA_TIME;
  }
  pong.render();

  requestAnimationFrame(update);
}
requestAnimationFrame(update);
