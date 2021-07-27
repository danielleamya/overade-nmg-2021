var Attractor = function (m) {
  this.pos = createVector(width / 2, height / 2, 0);
  this.mass = m;
  this.G = 1;

  this.calculateAttraction = function (p) {
    // Calculate direction of force
    var force = p5.Vector.sub(this.pos, p.pos);
    // Distance between objects
    var distance = force.mag();
    // Artificial constraint
    distance = constrain(distance, this.mass / 2, this.mass);
    // Normalize vector (distance doesn't matter here, we just want this vector for direction)
    force.normalize();
    // Calculate gravitional force magnitude
    var strength = (this.G * this.mass * p.mass) / (distance * distance);
    // Get force vector --> magnitude * direction
    force.mult(strength);
    return force;
  };

  // Method to display
  this.display = function () {
    push();
    translate(-width / 2, -height / 2);
    inc = incSliderValue;

    art.fill(0, 7);
    art.noFill();

    if(volume[frame] == volumeMax){
      background(0, 7);
    } 

    var yoff = 0;
    for (var y = 0; y < rows; y++) {
      var xoff = 0;
      for (var x = 0; x < cols; x++) {
        var index = x + y * cols;

        var angle = noise(xoff, yoff, zoff) * TWO_PI;
        var v = p5.Vector.fromAngle(angle);
        v.setMag(magSliderValue);

        flowField[index] = v;

        xoff = xoff + inc;
      }
      yoff = yoff + inc;
    }
    zoff = zoff + inc / 50;

    for (var i = 0; i < flowParticles.length; i++) {
      flowParticles[i].follow(flowField);
      flowParticles[i].update();
      flowParticles[i].edges();
      flowParticles[i].show();
      flowParticles[i].changemaxSpeed(maxSpeedValue);
    }
    pop();

    push();
    texture(art);

    noStroke();

    // Scaling Sphere
    let spectrum = fft.analyze();
    let amp = amplitude.getLevel();
    // noiseScale = map(amp, 0, 1, 0.1, 5);
    // let noiseVal = noise(time * noiseScale, time * noiseScale);

    energy = []
    append(energy, fft.getEnergy("bass"));
    append(energy, fft.getEnergy("mid"));
    append(energy, fft.getEnergy("treble"));
    
    // console.log(energy);

    let detail = floor(map(energy[2], 0, 100, 20, 0));
    let radius = map(amplitude.getLevel(), 0, 1, 0.5, 1);
    let r = (height / 2) * radius; // noiseVal
    sphere(r, detail, detail);
    // if (int(noiseVal) < 24) {
    //   // let level = amplitude.getLevel();
    //   // time += map(level, 0, 1, 0, 0.01);
    //   time += 0.001;
    // } else {
    //   time = 0;
    // }

    angle += 0.003;
    pop();
  };
};
