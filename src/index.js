import sim from './logic.js';

const speed = 200;

const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const autoCheckbox = document.getElementById('auto');

const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');

const subtract5Button = document.getElementById('subtract-5');
const subtract1Button = document.getElementById('subtract-1');
const stepRange = document.getElementById('step');
const stepLabel = document.getElementById('step-label');
const add1Button = document.getElementById('add-1');
const add5Button = document.getElementById('add-5');

const resetButton = document.getElementById('reset');

let interval;

function updateStepLabel() {
  stepLabel.innerText = `${sim.step}/${sim.maxSteps}`;
}

const maxWidth = parseInt(widthInput.max);
widthInput.oninput = () => {
  let value = parseInt(widthInput.value);
  if (value > widthInput.max) value = maxWidth;
  if (!isNaN(widthInput.value) && value > 0) sim.setWidth(value);
};
widthInput.onchange = () => {
  if (!widthInput.value) {
    widthInput.value = 1;
    widthInput.dispatchEvent(new Event('input'));
  } else if (parseInt(widthInput.value) > widthInput.max) {
    widthInput.value = widthInput.max;
    widthInput.dispatchEvent(new Event('input'));
  }
};

const maxHeight = parseInt(heightInput.max);
heightInput.oninput = () => {
  let value = parseInt(heightInput.value);
  if (value > heightInput.max) value = maxHeight;
  if (!isNaN(heightInput.value) && value > 0) sim.setHeight(value);
};
heightInput.onchange = () => {
  if (!heightInput.value) {
    heightInput.value = 1;
    heightInput.dispatchEvent(new Event('input'));
  } else if (parseInt(heightInput.value) > heightInput.max) {
    heightInput.value = heightInput.max;
    heightInput.dispatchEvent(new Event('input'));
  }
};

autoCheckbox.onchange = event => {
  sim.auto = event.target.checked;
  sim.reset();
};

startButton.onclick = () => {
  if (sim.done) sim.reset();

  interval = setInterval(() => {
    sim.advance();
    if (sim.done) clearInterval(interval);
  }, speed);
};

stepRange.oninput = event => {
  sim.setStep(event.target.value);
  updateStepLabel();
  clearInterval(interval);
};
sim.addListener(() => {
  stepRange.max = sim.maxSteps;
  stepRange.value = sim.step;
  updateStepLabel();
}, 'step');

subtract5Button.onclick = () => {
  sim.setStep(sim.step - 5);
  stepRange.value = sim.step;
  updateStepLabel();
};
subtract1Button.onclick = () => {
  sim.setStep(sim.step - 1);
  stepRange.value = sim.step;
  updateStepLabel();
};
add1Button.onclick = () => {
  sim.setStep(sim.step + 1);
  stepRange.value = sim.step;
  updateStepLabel();
};
add5Button.onclick = () => {
  sim.setStep(sim.step + 5);
  stepRange.value = sim.step;
  updateStepLabel();
};

stopButton.onclick = () => {
  clearInterval(interval);
};
sim.addListener(() => {
  clearInterval(interval);
}, 'init');

resetButton.onclick = () => {
  sim.reset();
  stepRange.value = sim.step;
  updateStepLabel();
};
