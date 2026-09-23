let canvas;
let canvasContext;

const ball = {
  pos: {
    x: 300,
    y: 400,
  },
  vel: {
    x: -5,
    y: -1,
  },
  radius: 10,
  maxBounceAngle: Math.PI / 4, // 45° off a paddle edge
  speedUp: 1.04,
  maxSpeed: 900,
};

const paddle1 = {
  pos: {
    x: 40,
    y: 40,
  },
  vel: {
    x: 5,
    y: 0,
  },
  size: {
    width: 15,
    height: 90,
  },
};

const paddle2 = {
  pos: {
    x: 800 - 15 - 40,
    y: 400,
  },
  vel: {
    x: 5,
    y: 0,
  },
  size: {
    width: 15,
    height: 90,
  },
};

const score = {
  player1: 0,
  player2: 0,
};

function startGame() {
  canvas = document.querySelector("#gameCanvas");
  canvasContext = canvas.getContext("2d");

  if (!canvasContext) return console.error("Rendering Context not loaded");

  const FPS = 60;
  setInterval(updateAll, 1000 / FPS);

  canvas.addEventListener("mousemove", updatePaddlePos);
}

function updateAll() {
  moveAll();
  drawAll();

  if (score.player1 === 7 || score.player2 === 7) {
    console.log("game over!");

    score.player1 = 0;
    score.player2 = 0;
    ballReset();
  }
}

function moveAll() {
  ball.pos.x += ball.vel.x;
  ball.pos.y += ball.vel.y;
  wallCollision();
  paddleCollision(paddle1);
  paddleCollision(paddle2, false);
  paddleAI(paddle2);
}

function paddleAI(paddle) {
  const paddleCenter = paddle.pos.y + paddle.size.height / 2;
  const ballCenter = ball.pos.y + ball.radius;
  const diff = ballCenter - paddleCenter;

  if (Math.abs(diff) < paddle.size.height / 4) return;
  paddle.pos.y += diff > 0 ? 6 : -6;
}

function ballReset() {
  ball.pos = {
    x: canvas.width / 2,
    y: canvas.height / 2,
  };
  ball.vel.x = 5;
  ball.vel.x *= -1;
}

function overlap(objA, objB) {
  return (
    objA.pos.x < objB.pos.x + objB.radius &&
    objA.pos.x + objA.size.width > objB.pos.x &&
    objA.pos.y < objB.pos.y + objB.radius &&
    objA.pos.y + objA.size.height > objB.pos.y
  );
}

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

    const dir = bIsLeft ? ball.pos.x : -ball.pos.x;
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
  if (ball.pos.x < 0) {
    score.player2++;
    ballReset();
  }

  // right
  if (ball.pos.x > canvas.clientWidth) {
    score.player1++;
    ballReset();
  }

  // top
  if (ball.pos.y < 0) {
    ball.vel.y *= -1;
  }

  // bottom
  if (ball.pos.y > canvas.clientHeight) {
    ball.vel.y *= -1;
  }
}

function drawAll() {
  drawRect();
  drawCircle(ball.pos, ball.radius, "red");
  drawRect(paddle1.pos, paddle1.size, "red");
  drawRect(paddle2.pos, paddle2.size, "red");

  drawScore();
}

function drawScore() {
  canvasContext.font = "25px monospace";
  canvasContext.fillStyle = "blue";
  canvasContext.textAlign = "center";
  canvasContext.fillText(
    `${score.player1} | ${score.player2}`,
    canvas.width / 2,
    40,
  );
}

function drawRect(
  pos = { x: 0, y: 0 },
  size = { width: canvas.clientWidth, height: canvas.clientHeight },
  color = "black",
) {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(pos.x, pos.y, size.width, size.height);
}

function drawCircle(pos = { x: 0, y: 0 }, radius, color) {
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
  canvasContext.fill();
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

window.onload = startGame();
