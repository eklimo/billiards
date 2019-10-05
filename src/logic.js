let listeners = {
  init: []
};

class Path {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }
}

function eq(a, b) {
  return Math.abs(a - b) <= 1.0e-5;
}
function lte(a, b) {
  return a < b || eq(a, b);
}
function gte(a, b) {
  return a > b || eq(a, b);
}

const speedCoefficient = 0.005;

class Simulation {
  constructor(width, height, speed) {
    this.width = width;
    this.height = height;
    this.speed = speed;

    this.reset();
  }

  reset() {
    this.done = false;

    this.x = 0;
    this.y = this.height;
    this.velocity = { x: 1, y: -1 };

    this.paths = [];
    this.bounceX = this.x;
    this.bounceY = this.y;

    this.updateListeners('init');
  }

  setWidth(width) {
    this.width = width;
    this.reset();
  }

  setHeight(height) {
    this.height = height;
    this.reset();
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  advance() {
    if (!this.done) {
      this.x += this.velocity.x * this.speed * speedCoefficient;
      this.y += this.velocity.y * this.speed * speedCoefficient;

      // check corner
      if (
        (lte(this.x, 0) && lte(this.y, 0)) ||
        (lte(this.x, 0) && gte(this.y, this.height)) ||
        (gte(this.x, this.width) && lte(this.y, 0)) ||
        (gte(this.x, this.width) && gte(this.y, this.height))
      ) {
        this.done = true;
        return;
      }

      // bounce
      else {
        let bounced = false;
        
        // bounce vertical
        if (lte(this.x, 0)) {
          this.velocity.x *= -1;
          bounced = true;
        } else if (gte(this.x, this.width)) {
          this.velocity.x *= -1;
          bounced = true;
        }
        // bounce horizontal
        if (lte(this.y, 0)) {
          this.velocity.y *= -1;
          bounced = true;
        } else if (gte(this.y, this.height)) {
          this.velocity.y *= -1;
          bounced = true;
        }

        if (bounced) {
          this.paths.push(new Path(this.bounceX, this.bounceY, this.x, this.y));
          this.bounceX = this.x;
          this.bounceY = this.y;
        }
      }
    }
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

let sim = new Simulation(2, 2, 10);

export default sim;
