/*************************************/
/*** CREATING CONTAINER FOR SKETCH ***/
/*************************************/
const CANVAS_BREAKPOINT = 700;
var canvas = document.createElement("div")
canvas.style.width = "100%";
canvas.style.height = "100%";
// canvas.style.filter = "hue-rotate(25deg) brightness(1)";
canvas.style.position="absolute";
canvas.style.top="0";
canvas.style.left="0";
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

//initialize arrays for glitch block types
let strips = new Array(15).fill(0)
let fragmentsHiRes = new Array(5).fill(0)
let fragmentsLowRes = new Array(10).fill(0)
let blackoutBlocks = new Array(10).fill(0)
let patternBlocks = new Array(10).fill(0)
let sampleBlocks = [] //final mixed container for strips/fragments

let testBlocks = new Array(20).fill(0);

function preload() {
  BASE_IMAGE_DATA = loadImage("./assets/base-image.png");
}

function setup() {
  rectMode(CENTER)
  imageMode(CENTER)
  createCanvas(windowWidth, windowHeight)
    .parent("canvas-bg")

  /** initialize graphics **/
  BASE_IMAGE = new BaseImage(BASE_IMAGE_DATA, 0.75)
  BASE_IMAGE.render()

  strips = strips.map(() => {
    return new GlitchStrip({
      sampleImage: BASE_IMAGE_DATA,
      sampleArea: new Area(0.65, 0.45),
      renderArea: new Area(0.8, 0.6),
      minSizeRatio: 0.05,
      maxSizeRatio: 0.1
    }).init()
  })

  loresTestSample = new Area(0.65, 0.6),
  fragmentsLowRes = fragmentsLowRes.map(() => {
    return new GlitchFragment({
      sampleImage: BASE_IMAGE_DATA,
      sampleArea: loresTestSample,
      renderArea: new Area(0.7, 0.5),
      minSizeRatio: 0.05,
      maxSizeRatio: 0.1,
      minSampleRatio: 0.01,
      maxSampleRatio: 0.03
    }).init()
  })

  fragmentsHiRes = fragmentsHiRes.map(() => {
    return new GlitchFragment({
      sampleImage: BASE_IMAGE_DATA,
      sampleArea: new Area(0.45, 0.35),
      renderArea: new Area(0.6, 0.4),
      minSizeRatio: 0.1,
      maxSizeRatio: 0.2,
      minSampleRatio: 0.15,
      maxSampleRatio: 0.3
    }).init()
  })

  blackoutBlocks = blackoutBlocks.map(() => {
    return new GlitchBlock({
      renderArea: new Area(0.8, 0.65),
      minSizeRatio: 0.1,
      maxSizeRatio: 0.2
    }).init()
  })



  //consolidate and shuffle strips & fragments into one layer
  // sampleBlocks = shuffle([...fragmentsHiRes, ...fragmentsLowRes, ...strips])
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  BASE_IMAGE.resize()
}

function draw() {
  clear()
  BASE_IMAGE.render()
  blackoutBlocks.forEach(block => block.render())
  fragmentsLowRes.forEach(fragment => fragment.render())
  fragmentsHiRes.forEach(fragment => fragment.render())
  strips.forEach(strip => strip.render())
  // loresTestSample.render()

  // sampleBlocks.forEach(block => block.render())
}

/*** HELPER METHODS ***/
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}