// Dataset Variables \\
var table;

var volume;
var volumeMin, volumeMax;

var open;
var openMin, openMax;

var high;
var highMin, highMax;

var low;
var lowMin, lowMax;

var close;
var closeMin, closeMax;

var adjClose;
var adjCloseMin, adjCloseMax;

var frame = 0;

// Ambient Particle Sysem Variables \\
var particles = [];
var attractor;
var maxParticles = 250;

// Flow Field Texture Variables \\
var art, angle;

var incSliderValue = 0;
//[0, 1];
var magSliderValue = 0;
//[-1, 1];
var maxSpeedValue = 0;
//[0, 5];

var inc = 0.01;
var scl = 50;
var zScale;
var zoff = 0;

var cols;
var rows;

var noOfPoints = 1000;

var flowParticles = [];
var flowField = [];

// Attractor Variables \\

var rotationScale = 0.1;
let noiseScale = 5;
let time = 0;

let alpha = 255;

let radi = [];
let orbitAngles = [];
let orbitSpeeds = [];

let circles = 6;

let audio;
let amplitude;
let fft;
let energy = [];

let start = false;

function preload() {
  table = loadTable("data/interpolated-data.csv", "csv", "header");
  audio = loadSound("data/Final-1.wav");
}

function setup() {
  background(51, alpha);
  createCanvas(windowWidth, windowHeight, WEBGL);
  stroke(235);
  noFill();
  attractor = new Attractor(random(100, 200));
  for (var i = 0; i < maxParticles; i++) {
    particles[i] = new Particle(
      random(width),
      random(height),
      random(-width / 2, width / 2),
      random(0.5, 2)
    );
  }

  cols = floor(width / scl);
  rows = floor(height / scl);

  art = createGraphics(width, height);

  for (var i = 0; i < cols * rows; i++) {
    append(flowField, []);
  }

  for (var i = 0; i < noOfPoints; i++) {
    append(flowParticles, new FlowParticle());
  }

  open = table.getColumn("Open");
  openMin = min(open);
  openMax = max(open);

  close = table.getColumn("Close");
  closeMin = min(close);
  closeMax = max(close);

  high = table.getColumn("High");
  highMin = min(high);
  highMax = max(high);

  low = table.getColumn("Low");
  lowMin = min(low);
  lowMax = max(low);

  adjClose = table.getColumn("Adj Close");
  adjCloseMin = min(adjClose);
  adjCloseMax = max(adjClose);

  volume = table.getColumn("Volume");
  volumeMin = min(volume);
  volumeMax = max(volume);
  for (var i = 0; i < circles; i++) {
    if (i == circles - 1) {
      append(radi, ((height * 0.25) / circles) * (i + 1) + height / 1.5);
    }
    append(orbitAngles, 0);
    append(orbitSpeeds, random(0, 0.1));
  }

  amplitude = new p5.Amplitude();
  fft = new p5.FFT();
  // audio.play();
  // audio.loop();
}

function draw() {
  orbitControl();

  push();
  fill(0, alpha);
  translate(-width / 2, -height / 2);
  rect(0, 0, width, height);
  stroke(alpha, 1 - alpha);
  Orbit();
  // image(art, 0, 0);
  pop();

  let rotationChange = [];
  append(rotationChange, map(energy[0], 0, 255, 0, 0.001));
  append(rotationChange, map(energy[1], 0, 255, 0, 0.001));
  append(rotationChange, map(energy[0] + energy[1], 0, 510, 0, 0.001));


  let rotScale = map(energy[2], 0, 255, 1, 5);
  if(rotScale < 2){
    rotScale = 1;
  }

  rotateX(frameCount * rotScale * rotationChange[0]);
  rotateY(frameCount * rotScale * rotationChange[1]);
  rotateZ(frameCount * rotScale * rotationChange[2]);

  attractor.display();
  translate(-width / 2, -height / 2);

  for (var i = 0; i < particles.length; i++) {
    var force = attractor.calculateAttraction(particles[i]);
    particles[i].applyForce(force);
    if (mouseIsPressed) {
      particles[i].brightness(random(0, 255));
    }

    particles[i].update();
    particles[i].display();
  }

  if (start) {
    // update particle number based on volume data
    if (frame < volume.length) {
      if (millis() % 1000 <= 1000 / getFrameRate()) {
        var particleNum = ceil(
          map(volume[frame], volumeMin, volumeMax, 5, 250)
        );
        var newMax = particleNum;
        if (maxParticles != newMax) {
          var d = abs(maxParticles - newMax);
          if (maxParticles > newMax) {
            for (var i = 0; i < d; i++) {
              particles.splice(0, 1);
            }
          } else {
            for (var i = 0; i < d; i++) {
              var p = new Particle(
                random(width),
                random(height),
                random(-width / 2, width / 2),
                random(1, 4)
              );
              particles.push(p);
            }
          }
        }
        alpha = map(volume[frame], volumeMin, volumeMax, 255, 0);

        incSliderValue =
          map(open[frame], openMin, openMax, 0.01, 1) +
          map(energy[2], 0, 255, 0.01, 1);

        magSliderValue = map(high[frame], highMin, highMax, -0.5, -1);
        if (abs(magSliderValue) > 0.5) {
          magSliderValue = abs(magSliderValue);
        }

        maxSpeedValue = map(energy[2], 0, 255, 0.01, 10);

        maxParticles = newMax;
        frame++;
        // console.log(maxSpeedValue);
      }
    }
  }
}

function mousePressed() {
  if ((frame == 0) && !audio.isPlaying()) {
    audio.play();
    // audio.loop();
    start = true;
  }
  
  if(frame > 0 && !audio.isPlaying()){ //volume.length
    frame = 0;
    audio.play();
  }
  
}
