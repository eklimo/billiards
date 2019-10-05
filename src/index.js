import sim from './logic.js';
import renderer from './renderer.js';

let running = false;

function start() {
  if (!running) {
    running = true;
    loop();
  }
}

function stop() {
  running = false;
}

function loop() {
  sim.advance();
  if (sim.done) running = false;
  renderer.draw();
  if (running) requestAnimationFrame(loop);
}

const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');

const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');

const speedRange = document.getElementById('speed');
const speedLabel = document.getElementById('speed-label');

const resetButton = document.getElementById('reset');

function updateSpeedLabel() {
  speedLabel.innerText = `Speed: ${(sim.speed / 10).toFixed(1)}`;
}

const maxSize = 100;
widthInput.oninput = () => {
  let value = parseFloat(widthInput.value);
  if (value > maxSize) value = maxSize;
  if (!isNaN(value) && value > 0) sim.setWidth(value);
};
widthInput.onchange = () => {
  if (!widthInput.value) {
    widthInput.value = 1;
    widthInput.dispatchEvent(new Event('input'));
  } else if (parseFloat(widthInput.value) > maxSize) {
    widthInput.value = maxSize;
    widthInput.dispatchEvent(new Event('input'));
  }
};

heightInput.oninput = () => {
  let value = parseFloat(heightInput.value);
  if (value > maxSize) value = maxSize;
  if (!isNaN(value) && value > 0) sim.setHeight(value);
};
heightInput.onchange = () => {
  if (!heightInput.value) {
    heightInput.value = 1;
    heightInput.dispatchEvent(new Event('input'));
  } else if (parseFloat(heightInput.value) > maxSize) {
    heightInput.value = maxSize;
    heightInput.dispatchEvent(new Event('input'));
  }
};

startButton.onclick = () => {
  if (sim.done) sim.reset();
  start();
};

stopButton.onclick = stop;
sim.addListener(stop, 'init');

speedRange.oninput = event => {
  sim.setSpeed(event.target.value);
  updateSpeedLabel();
};

resetButton.onclick = () => {
  sim.reset();
  renderer.draw();
};
