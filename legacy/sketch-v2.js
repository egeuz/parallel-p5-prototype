/*************************************/
/*** CREATING CONTAINER FOR SKETCH ***/
/*************************************/
const CANVAS_BREAKPOINT = 700;
var canvas = document.createElement("div")
canvas.style.width = "100%";
canvas.style.height = "100%";
// canvas.style.filter = "hue-rotate(0deg) saturate(0.8) brightness(1.1)";
canvas.id = "canvas-bg"
//handle basic responsiveness for canvas element
canvas.style.display = window.innerWidth >= 700 ? "block" : "none"
window.addEventListener("resize", () => {
  canvas.style.display = window.innerWidth >= 700 ? "block" : "none"
})
//change document.body to whatever element we're sticking this into
document.body.appendChild(canvas)

/*** END SKETCH CONTAINER ***/

/******************/
/*** P5 RUNTIME ***/
/******************/
const BASE_IMAGE_FILENAME = "./assets/base-image.png"
const NUM_GLITCH_STRIPS = 40;
const NUM_GLITCH_BLOCKS = 40;
let BASE_IMAGE_DATA;
let baseImage;
let glitchStrips = new Array(NUM_GLITCH_STRIPS).fill(0);
let glitchBlocks = new Array(NUM_GLITCH_BLOCKS).fill(0);

function preload() {
  BASE_IMAGE_DATA = loadImage("./assets/base-image.png");
}

function setup() {
  frameRate(15)
  rectMode(CENTER)
  imageMode(CENTER)
  createCanvas(windowWidth, windowHeight)
    .parent("canvas-bg")

  baseImage = new BaseImage(BASE_IMAGE_DATA, 0.75)
  glitchStrips = glitchStrips.map(() => {
    return new GlitchStrip({
      sampleImage: BASE_IMAGE_DATA,
      sampleArea: new Area(0.7),
      placementArea: new Area(0.7, 0.1),
      minRatio: 0.05,
      maxRatio: 0.15
    }).generateRenderShape()
  })
  glitchBlocks = glitchBlocks.map(() => {
    return new GlitchBlock({
      sampleImage: BASE_IMAGE_DATA,
      sampleArea: new Area(0.75, 0.7),
      placementArea: new Area(0.7),
      minRatio: 0.05,
      maxRatio: 0.1,
      minSampleRatio: 0.01,
      maxSampleRatio: 0.2
    }).generateRenderShape()
  })
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  baseImage.resize()
  glitchStrips.forEach(strip => strip.resize())
  glitchBlocks.forEach(block => block.resize())
}

function mouseMoved() {
  glitchStrips.forEach(strip => strip.resize())
  glitchBlocks.forEach(block => block.resize())
}

function mousePressed() {
  console.log("hey")
}

function draw() {
  // background(0)
  clear()
  // baseImage.render()
  glitchStrips.forEach(strip => strip.render())
  glitchBlocks.forEach(block => block.render())
}
/*** END P5 RUNTIME ***/