//I wanted to make the user be able to be creative this time.
//I want them to draw with their nose. I got the code from p5js 
//examples https://editor.p5js.org/AndreasRef/sketches/r1_w73FhQ
//I also want to have a little "mini game" for the user so I put
//little hints about about where to go. ps, the volumes for the
//sound might be a little bit loud.
//The sounds came from the Week 06 examples called loadSounds
//I also got the font from google fonts

let video;
let poseNet; 
let poses = [];
let skeletons = [];

let pg;
let noseX;
let noseY;

let pNoseX;
let pNoseY;

let ufo;
let prism;
let strike;
let piston;

let fontM;

function setup() {
  createCanvas(720, 540);
  video = createCapture(VIDEO);
  video.size(width, height);

  //loading the sound for later on when I do the play() function
  ufo = loadSound('../assets/assets_sounds_ufo.mp3');
  strike = loadSound('../assets/assets_sounds_strike.mp3');
  piston = loadSound('../assets/assets_sounds_piston-2.mp3');
  prism = loadSound('../assets/assets_sounds_prism-1.mp3');

  //wanted to add some font for the hidden messages
  fontM = loadFont('assets/Montserrat-B.ttf');

  pixelDensity(1);
  pg = createGraphics(width, height);

  poseNet = ml5.poseNet(video, modelReady);

  poseNet.on('pose', function(results) {
    poses = results;
  });

  video.hide();
}

function draw() {
  image(video, 0, 0, width, height);

  image(pg, 0, 0, width, height);
  drawKeypoints();


  //Added some keypoints that if the user gets to it it will do something
  //show the text and play some sound. 
  if(((100 < noseY) && (noseY < 150)) && ((50 < noseX) && (noseX < 150))) {
    ufo.volume = 0.2; //tried lowering down the volume but it doesn't seen to work
    ufo.play();
    textSize(30);
    textFont(fontM);
    text('Being at the top is lonely, so I left', 100, 50);
  } 
  
  else if(((450 < noseY) && (noseY < 550)) && ((50 < noseX) && (noseX < 150))) {
    textSize(30);
    textFont(fontM);
    text('You left because I hit rock bottom', 100, 50);
    prism.volume = 0.2;
    prism.play();
  } 
  
  else if(((100 < noseY) && (noseY < 150)) && ((550 < noseX) && (noseX < 650))) {
    textSize(30);
    textFont(fontM);
    text('Its at the top, right?', 100, 50);
    piston.volume = 0.2;
    piston.play();
  } 
  
  else if(((450 < noseY) && (noseY < 550)) && ((550 < noseX) && (noseX < 650))) {
    textSize(30);
    textFont(fontM);
    text('Bottom line is.. Im punny, right?', 100, 50);
    strike.volume = 0.2;
    strike.play();
  }  
}

function drawKeypoints() {
  for (let i = 0; i < min(poses.length, 1); i++) {
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
      let keypoint = poses[i].pose.keypoints[j];
      if (keypoint.score > 0.2) {
        if (j == 0) {
          noseX = keypoint.position.x;
          noseY = keypoint.position.y;

          pg.stroke(random(87)); // change it from orange to randomizing from 0-87
          pg.strokeWeight(5);
          pg.line(noseX, noseY, pNoseX, pNoseY);

          pNoseX = noseX;
          pNoseY = noseY;
        }
      }
    }
  }
}

function drawSkeleton() {
  for (let i = 0; i < poses.length; i++) {
    for (let j = 0; j < poses[i].skeleton.length; j++) {
      let partA = poses[i].skeleton[j][0];
      let partB = poses[i].skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

function gotPoses(results) {
  poses = results;
}

function keyPressed() {
  pg.clear();
}

function modelReady() {
  select('#status').html('model Loaded');
}