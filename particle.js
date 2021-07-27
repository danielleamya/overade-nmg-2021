function Particle(x, y, z, m) {
  this.pos = createVector(x, y, z);
  this.mass = m;

  this.vel = createVector(1, 0);
  this.acc = createVector(0, 0);

  this.brightness = function (bri) {
    b = bri;
    stroke(b);
  };

  // this.fadeIn = function(){
  //   for (var i = 0; i < 255; i+=0.001){
  //     stroke(i);
  //   }
  // }

  this.applyForce = function (force) {
    var f = force.copy();
    f.div(this.mass);
    this.acc.add(f);
  };

  //   this.showConnections = function (maxParticles) {

  //   };

  this.update = function () {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  };

  this.display = function () {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    let high = map(energy[2], 0, 50, 0, 255);
    let alpha = map(energy[1] + high, 0, 510, 100, 255);
    // console.log(high);
    stroke(alpha, energy[0]);
    sphere(this.mass * 2, 5);
    pop();
  };
}

function FlowParticle() {
  this.pos = createVector(random(width), random(height));
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  var maxSpeed = 2;
  var g = 0;
  var b = 255;
  var reverse;

  var prevPos = this.pos.copy();

  this.update = function () {
    this.vel.add(this.acc);
    this.vel.limit(maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  };

  this.changemaxSpeed = function (speed) {
    maxSpeed = speed;
  };

  this.applyForce = function (force) {
    this.acc.add(force);
  };

  this.follow = function (vectors) {
    var x = floor(this.pos.x / scl);
    var y = floor(this.pos.y / scl);
    var index = x - 1 + (y - 1) * cols;
    index = index - 1;
    if (index > vectors.length || index < 0) {
      index = vectors.length - 1;
    }
    force = vectors[index];
    this.applyForce(force);
  };

  this.show = function () {
    if (reverse) {
      g--;
      b++;
    } else {
      g++;
      b--;
    }

    if (g > 255) {
      reverse = true;
      //art.background(0, 7);
    }
    if (g < 0) {
      reverse = false;
    }

    // if (maxSpeedValue > 3) {
    //   var color = 255-g;
    //   art.background(color, 10);
    // }
    art.stroke(g, b);
    //art.strokeWeight(2);
    art.point(this.pos.x, this.pos.y);
  };

  this.updatePrev = function () {
    prevPos.x = this.pos.x;
    prevPos.y = this.pos.y;
  };

  this.edges = function () {
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.updatePrev();
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
      this.updatePrev();
    }

    if (this.pos.y > height) {
      this.pos.y = 0;
      this.updatePrev();
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
      this.updatePrev();
    }
  };
}

function Orbit() {
  for (var i = 0; i < radi.length; i++) {
    ellipse(width / 2, height / 2, radi[i], radi[i], 50);
  }

  for (var i = 0; i < orbitAngles.length; i++) {
    var x = width / 2 + (radi[0] / 2) * cos(orbitAngles[i]);
    var y = height / 2 + (radi[0] / 2) * sin(orbitAngles[i]);
    if (i == 0) {
      orbitSpeeds[i] = map(high[frame], highMin, highMax, 0.01, 0.1);
      orbitAngles[i] += orbitSpeeds[i];
    }
    if (i == 1) {
      orbitSpeeds[i] = map(low[frame], lowMin, lowMax, 0.01, 0.1);
      orbitAngles[i] += orbitSpeeds[i];
    }
    if (i == 2) {
      orbitSpeeds[i] = map(open[frame], openMin, openMax, 0.01, 0.1);
      orbitAngles[i] += orbitSpeeds[i];
    }
    if (i == 3) {
      orbitSpeeds[i] = map(close[frame], closeMin, closeMax, 0.01, 0.1);
      orbitAngles[i] += orbitSpeeds[i];
    }
    if (i == 4) {
      orbitSpeeds[i] = map(
        adjClose[frame],
        adjCloseMin,
        adjCloseMax,
        0.01,
        0.1
      );
      orbitAngles[i] += orbitSpeeds[i];
    }
    if (i == 5) {
      orbitSpeeds[i] = map(volume[frame], volumeMin, volumeMax, 0.01, 0.1);
      orbitAngles[i] += orbitSpeeds[i];
    }
    ellipse(x, y, 10, 10);
  }
}
