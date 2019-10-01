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
  for (let x = 0; x < sim.width; x++) {
    for (let y = 0; y < sim.height; y++) {
      ctx.strokeRect(
        offsetLeft + paddingLeft + x * squareSize,
        offsetTop + paddingTop + y * squareSize,
        squareSize,
        squareSize
      );
    }
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

function drawSteps() {
  for (let i = 0; i < sim.steps.length; i++) {
    const step = sim.steps[i];
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = sim.step > i ? 'gray' : 'lightGray';
    ctx.beginPath();
    ctx.moveTo(
      offsetLeft + paddingLeft + step.x1 * squareSize,
      offsetTop + paddingTop + step.y1 * squareSize
    );
    ctx.lineTo(
      offsetLeft + paddingLeft + step.x2 * squareSize,
      offsetTop + paddingTop + step.y2 * squareSize
    );
    ctx.stroke();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  rescale();
  drawGrid();
  drawSteps();
  drawHoles();
  drawBall();
}

draw();

sim.addListener(() => {
  draw();
});
