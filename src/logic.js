let listeners = {
  init: [],
  step: []
};

class Step {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }
}

class Simulation {
  constructor(width, height, auto) {
    this.width = width;
    this.height = height;
    this.auto = auto;

    this.reset();
  }

  reset() {
    this.step = 0;
    this.maxSteps = 0;
    this.steps = [];
    this.done = false;

    this.x = 0;
    this.y = this.height;
    this.velocity = { x: 1, y: -1 };
    // simulate to get max steps
    while (!this.done) {
      this.advance();
      this.maxSteps++;
    }
    if (!this.auto) {
      this.step = 0;
      this.steps = [];
      this.done = false;
      this.x = 0;
      this.y = this.height;
      this.velocity = { x: 1, y: -1 };
    }

    this.updateListeners('init');
    this.updateListeners('step');
  }

  setWidth(width) {
    this.width = width;
    this.reset();
  }

  setHeight(height) {
    this.height = height;
    this.reset();
  }

  advance() {
    if (!this.done) {
      this.step++;

      const prevX = this.x,
        prevY = this.y;
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.steps.push(new Step(prevX, prevY, this.x, this.y));

      // check corner
      if (
        (this.x == 0 && this.y == 0) ||
        (this.x == 0 && this.y == this.height) ||
        (this.x == this.width && this.y == 0) ||
        (this.x == this.width && this.y == this.height)
      ) {
        this.done = true;
      }

      // bounce vertical
      else if (this.x == 0 || this.x == this.width) {
        this.velocity.x *= -1;
      }

      // bounce horizontal
      else if (this.y == 0 || this.y == this.height) {
        this.velocity.y *= -1;
      }

      this.updateListeners('step');
    }
  }

  undo() {
    if (this.step > 0) {
      const prev = this.steps.pop();
      this.step--;
      this.x = prev.x1;
      this.y = prev.y1;
      this.velocity.x = prev.x2 - prev.x1;
      this.velocity.y = prev.y2 - prev.y1;
      this.done = false;
    } else {
      this.done = true;
    }
  }

  setStep(step) {
    if (step < 0) step = 0;

    if (this.step > step) {
      while (this.step != step) this.undo();
    } else {
      while (this.step != step && !this.done) this.advance();
    }

    this.updateListeners('step');
  }

  addListener(listener, type) {
    if (!type) for (const t of Object.values(listeners)) t.push(listener);
    else listeners[type].push(listener);
  }

  updateListeners(type) {
    for (const listener of Object.values(listeners[type])) {
      listener();
    }
  }
}

let sim = new Simulation(2, 2);

export default sim;
