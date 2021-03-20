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
const BASE_IMAGE_FILENAME = "./assets/base-image.png"
let BASE_IMAGE_DATA; //will contain p5.Image
let BASE_IMAGE; //will contain BaseImage instance
// var pg;

//initialize arrays for glitch block types
let strips = new Array(10).fill(0)
let fragmentsHiRes = new Array(5).fill(0)
let fragmentsLowRes = new Array(8).fill(0)
let blackoutBlocks = new Array(12).fill(0)
let patternBlocks = new Array(10).fill(0)
let sampleBlocks = [] //final mixed container for strips/fragments

let prevMouseX;
let prevMouseY;
let prevMouseDelta = 0;

function preload() {
  BASE_IMAGE_DATA = loadImage("./assets/base-image.png");
}

function setup() {
  frameRate(10)
  rectMode(CENTER)
  imageMode(CENTER)
  createCanvas(windowWidth, windowHeight)
    .parent("canvas-bg")
  pg = createGraphics(windowWidth, windowHeight)

  /** initialize graphics **/
  BASE_IMAGE = new BaseImage(BASE_IMAGE_DATA, 1.125)
  // BASE_IMAGE.renderOnBuffer(pg)
  BASE_IMAGE.render()

  strips = strips.map(() => {
    return new GlitchStrip({
      sampleImage: BASE_IMAGE_DATA,
      sampleArea: new Area(0.65, 0.45),
      renderArea: new Area(0.8, 0.6),
      minSizeRatio: 0.075 * 0.2,
      maxSizeRatio: 0.125 * 0.2
    }).init()
  })

  fragmentsLowRes = fragmentsLowRes.map(() => {
    return new GlitchFragment({
      sampleImage: BASE_IMAGE_DATA,
      sampleArea: new Area(0.75, 0.45),
      renderArea: new Area(0.7, 0.5),
      minSizeRatio: 0.075 * 0.2,
      maxSizeRatio: 0.125 * 0.2,
      minSampleRatio: 0.01,
      maxSampleRatio: 0.03
    }).init()
  })

  fragmentsHiRes = fragmentsHiRes.map(() => {
    return new GlitchFragment({
      sampleImage: BASE_IMAGE_DATA,
      sampleArea: new Area(0.45, 0.35),
      renderArea: new Area(0.6, 0.4),
      minSizeRatio: 0.125 * 0.2,
      maxSizeRatio: 0.2125 * 0.2,
      minSampleRatio: 0.15,
      maxSampleRatio: 0.3
    }).init()
  })

  blackoutBlocks = blackoutBlocks.map(() => {
    return new GlitchBlock({
      renderArea: new Area(0.8, 0.65),
      minSizeRatio: 0.125 * 0.2,
      maxSizeRatio: 0.175 * 0.2
    }).init()
  })

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
  mouseDelta = dist(mouseX, mouseY, prevMouseX, prevMouseY)
  if (mouseDelta > 3) {
    glitchOut()
  } else if (prevMouseDelta != mouseDelta) {
    snapBack()
  }
  background(0)
  BASE_IMAGE.render()
  blackoutBlocks.forEach(block => block.render())
  sampleBlocks.forEach(block => block.render())
  //set mousePos

  prevMouseX = mouseX
  prevMouseY = mouseY
  prevMouseDelta = mouseDelta
}

function glitchOut() {
  sampleBlocks.forEach(sample => sample.glitchOut())
  blackoutBlocks.forEach(block => block.init())
}

function snapBack() {
  sampleBlocks.forEach(sample => sample.snapBack())
}

/*** HELPER METHODS ***/
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}