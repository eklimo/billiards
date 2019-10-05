import sim from './logic.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const gridWidth = 600,
  gridHeight = 400;
const offsetLeft = canvas.width / 2 - gridWidth / 2,
  offsetTop = canvas.height / 2 - gridHeight / 2;

const defaultSquareSize = 100;
let squareSize = defaultSquareSize;
let scaleX = 1,
  scaleY = 1,
  scale = 1;
let paddingLeft = 0,
  paddingTop = 0;

rescale();

function rescale() {
  scaleX = Math.min(gridWidth / (sim.width * defaultSquareSize), 1);
  scaleY = Math.min(gridHeight / (sim.height * defaultSquareSize), 1);
  scale = Math.min(scaleX, scaleY);
  squareSize = 100 * scale;
  paddingLeft = gridWidth / 2 - (sim.width * squareSize) / 2;
  paddingTop = gridHeight / 2 - (sim.height * squareSize) / 2;
}

function drawGrid() {
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = 'black';
  ctx.strokeRect(
    offsetLeft + paddingLeft,
    offsetTop + paddingTop,
    sim.width * squareSize,
    sim.height * squareSize
  );

  ctx.lineWidth = 0.5;
  ctx.strokeStyle = 'lightGray';
  for (let x = 1; x < sim.width; x++) {
    ctx.beginPath();
    ctx.moveTo(
      offsetLeft + paddingLeft + x * squareSize,
      offsetTop + paddingTop + 0 * squareSize
    );
    ctx.lineTo(
      offsetLeft + paddingLeft + x * squareSize,
      offsetTop + paddingTop + sim.height * squareSize
    );
    ctx.stroke();
  }
  for (let y = 1; y < sim.height; y++) {
    ctx.beginPath();
    ctx.moveTo(
      offsetLeft + paddingLeft + 0 * squareSize,
      offsetTop + paddingTop + y * squareSize
    );
    ctx.lineTo(
      offsetLeft + paddingLeft + sim.width * squareSize,
      offsetTop + paddingTop + y * squareSize
    );
    ctx.stroke();
  }
}

function drawBall() {
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(
    offsetLeft + paddingLeft + sim.x * squareSize,
    offsetTop + paddingTop + sim.y * squareSize,
    7 * Math.sqrt(scale),
    0,
    2 * Math.PI
  );
  ctx.fill();
}

function drawHoles() {
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'blue';

  ctx.beginPath();
  ctx.arc(
    offsetLeft + paddingLeft + 0,
    offsetTop + paddingTop + 0,
    8 * Math.sqrt(scale),
    0,
    2 * Math.PI
  );
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(
    offsetLeft + paddingLeft + sim.width * squareSize,
    offsetTop + paddingTop,
    8 * Math.sqrt(scale),
    0,
    2 * Math.PI
  );
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(
    offsetLeft + paddingLeft + 0,
    offsetTop + paddingTop + sim.height * squareSize,
    8 * Math.sqrt(scale),
    0,
    2 * Math.PI
  );
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(
    offsetLeft + paddingLeft + sim.width * squareSize,
    offsetTop + paddingTop + sim.height * squareSize,
    8 * Math.sqrt(scale),
    0,
    2 * Math.PI
  );
  ctx.stroke();
}

function drawPaths() {
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'gray';

  // draw completed paths
  for (let i = 0; i < sim.paths.length; i++) {
    const path = sim.paths[i];
    ctx.beginPath();
    ctx.moveTo(
      offsetLeft + paddingLeft + path.x1 * squareSize,
      offsetTop + paddingTop + path.y1 * squareSize
    );
    ctx.lineTo(
      offsetLeft + paddingLeft + path.x2 * squareSize,
      offsetTop + paddingTop + path.y2 * squareSize
    );
    ctx.stroke();
  }

  // draw current path
  ctx.beginPath();
  ctx.moveTo(
    offsetLeft + paddingLeft + sim.bounceX * squareSize,
    offsetTop + paddingTop + sim.bounceY * squareSize
  );
  ctx.lineTo(
    offsetLeft + paddingLeft + sim.x * squareSize,
    offsetTop + paddingTop + sim.y * squareSize
  );
  ctx.stroke();
}

function draw() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  rescale();
  drawGrid();
  drawPaths();
  drawHoles();
  drawBall();
}
draw();

export default { draw };

sim.addListener(() => {
  draw();
}, 'init');
