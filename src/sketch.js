/*************************************/
/*** CREATING CONTAINER FOR SKETCH ***/
/*************************************/
const CANVAS_BREAKPOINT = 700;
var canvas = document.createElement("div")
canvas.style.width = "100%";
canvas.style.height = "100%";
// canvas.style.filter = "hue-rotate(25deg) brightness(1)";
canvas.style.position = "absolute";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.zIndex = "-1";

canvas.id = "canvas-bg"
//handle basic responsiveness for canvas element
canvas.style.display = window.innerWidth >= 700 ? "block" : "none"
window.addEventListener("resize", () => {
  canvas.style.display = window.innerWidth >= 700 ? "block" : "none"
})
//change document.body to whatever element we're sticking this into
document.body.appendChild(canvas)

/******************/
/*** P5 RUNTIME ***/
/******************/
//base image variables
// const BASE_IMAGE_FILENAME = "../assets/base-image.png"
let BASE_IMAGE_DATA; //will contain p5.Image
let BASE_IMAGE; //will contain BaseImage instance

const BACKGROUND_IMAGE_FILE = "../assets/background_image.png"
let BACKGROUND_IMAGE_DATA;

const SAMPLE_IMAGE_FILE = "../assets/background_image.png"
let sampleImage;



//initialize arrays for glitch block types
let strips = new Array(8).fill(0)
let fragmentsHiRes = new Array(15).fill(0)
let fragmentsLowRes = new Array(15).fill(0)
let blackoutBlocks = new Array(16).fill(0)
// let patternBlocks = new Array(6).fill(0)
let sampleBlocks = [] //final mixed container for strips/fragments

let prevMouseX;
let prevMouseY;
let prevMouseDelta = 0;

function preload() {
  // BASE_IMAGE_DATA = loadImage("./assets/base-image.png");
  BACKGROUND_IMAGE_DATA = loadImage(BACKGROUND_IMAGE_FILE)
  sampleImage = loadImage(SAMPLE_IMAGE_FILE)
}

function setup() {
  frameRate(24)
  rectMode(CENTER)
  imageMode(CENTER)
  createCanvas(windowWidth, windowHeight)
    .parent("canvas-bg")
  pg = createGraphics(windowWidth, windowHeight)

  /** initialize graphics **/
  BASE_IMAGE = new BaseImage(BACKGROUND_IMAGE_DATA, 0.8)

  strips = strips.map(() => {
    return new GlitchStrip({
      sampleImage: sampleImage,
      sampleArea: new Area(1, 0.01, sampleImage).init(),
      renderArea: new Area(0.75).init(),
      minSizeRatio: 0.04,
      maxSizeRatio: 0.017
    }).init()
  })

  fragmentsLowRes = fragmentsLowRes.map(() => {
    return new GlitchFragment({
      sampleImage: sampleImage,
      sampleArea: new Area(1, 0.4, sampleImage).init(),
      renderArea: new Area(0.7).init(),
      minSizeRatio: 0.04,
      maxSizeRatio: 0.07,
      minSampleRatio: 0.1,
      maxSampleRatio: 0.15
    }).init()
  })

  fragmentsHiRes = fragmentsHiRes.map(() => {
    return new GlitchFragment({
      sampleImage: sampleImage,
      sampleArea: new Area(1, 0.1, sampleImage).init(),
      renderArea: new Area(0.6).init(),
      minSizeRatio: 0.09,
      maxSizeRatio: 0.16,
      minSampleRatio: 0.2,
      maxSampleRatio: 0.25
    }).init()
  })

  blackoutBlocks = blackoutBlocks.map(() => {
    return new GlitchBlock({
      renderArea: new Area(0.8, 0.55).init(),
      minSizeRatio: 0.125 * 0.65,
      maxSizeRatio: 0.175 * 0.65
    }).init()
  })

  // patternBlocks = patternBlocks.map(() => {
  //   return new GlitchPattern({
  //     sampleArea: new Area(0.7, 0.55, sampleImage).init(),
  //     renderArea: new Area(0.6, 0.25).init(),
  //     minSizeRatio: 0.125 * 0.25,
  //     maxSizeRatio: 0.175 * 0.25,
  //     color: "#ffffff",
  //     background: "#00000000" //transparent bbyyy
  //   }).init()
  // })

  //consolidate and shuffle strips & fragments into one layer
  sampleBlocks = shuffle([...fragmentsHiRes, ...fragmentsLowRes, ...strips])
  prevMouseX = mouseX;
  prevMouseY = mouseY;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  BASE_IMAGE.resize()
}

function draw() {
  background("#121212")
  BASE_IMAGE.render()
  blackoutBlocks.forEach(block => block.render())
  sampleBlocks.forEach(block => block.render())

  if (noise(frameCount) < 0.25) glitchOut()
}

function mouseMoved() {
  // glitchOut()
  if (random() < 0.75) glitchOut()
}

function glitchOut() {
  sampleBlocks.forEach(block => {if (random() < 0.3) block.glitchOut()})
  blackoutBlocks.forEach(block => { if (random() < 0.5) block.init()})
  // patternBlocks.forEach(block => block.glitchOut())
}

function snapBack() {
  sampleBlocks.forEach(block => block.snapBack())
  // patternBlocks.forEach(block => block.snapBack())
}

/*** HELPER METHODS ***/
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}