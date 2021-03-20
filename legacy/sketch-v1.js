/************************/
/*** JAVASCRIPT SETUP ***/
/************************/
//styles for body -- remove this later
document.body.style.margin = 0;

//generate a background div to put our canvas into
const canvasBG = document.createElement("div")
canvasBG.style.width = "100%";
canvasBG.style.height = "100%";
canvasBG.style.position = "fixed";
canvasBG.style.zIndex = "-1";
canvasBG.style.top = "0";
canvasBG.style.left = "0";
canvasBG.style.filter = "hue-rotate(200deg) brightness(110%) contrast(100%)"
canvasBG.id = "canvas-bg";

//remove the canvas BG responsively for mobile view
const RESPONSIVE_BREAKPOINT = 500;
canvasBG.style.display = window.innerWidth < RESPONSIVE_BREAKPOINT ? "none" : "block"
window.addEventListener("resize", e => {
  canvasBG.style.display = window.innerWidth < RESPONSIVE_BREAKPOINT ? "none" : "block"
})

//add the element into html.
//replace document.body & remove position styles if it's only gonna be visible in the landing
document.body.appendChild(canvasBG)

/******************/
/*** P5 RUNTIME ***/
/******************/
/*** PARAMETERS ***/
//all values are width/height ratios based on screen size
const BASE_IMAGE_SCALE = 0.75; //screen area the base image takes up
const GLITCH_SAMPLE_RANGE_SCALE = 0.6; //screen area from where we pull glitch samples
const IMAGE_SLICE_RANGE_SCALE = 0.3;
const IMAGE_SLICE_PLACEMENT_FRAME = [0.6, 0.1];
const GLITCH_BLOCK_PLACEMENT_FRAME = [0.7, 0.25] //screen area (a frame) where we place glitch blocks
const BLACK_BLOCK_PLACEMENT_FRAME = [0.9, 0.85] //screen area (a frame) where we place black blocks
const STAMP_PLACEMENT_FRAME = [0.85, 0.1] //screen area (a frame) where we place glitch stamps

//these values are just amounts friend
const NUM_GLITCH_BLOCKS = 10;
const NUM_BLACK_BLOCKS = 10;
const NUM_IMAGE_SLICES = 10;
const NUM_STAMPS = 10;

/*** ASSETS ***/
const waveAssets = [
  "wave-10-1", "wave-10-2", "wave-10-3", "wave-10-4", "wave-10-5", "wave-10-6", "wave-10-7", "wave-10-8", "wave-10-9", "wave-10-10", "wave-23-1", "wave-23-2", "wave-23-3", "wave-23-4", "wave-23-5", "wave-23-6", "wave-23-7", "wave-23-8", "wave-23-9", "wave-23-10", "wave-36-1", "wave-36-2", "wave-36-3", "wave-36-4", "wave-36-5", "wave-36-6", "wave-36-7", "wave-36-8", "wave-36-9", "wave-36-10", "wave-49-1", "wave-49-2", "wave-49-3", "wave-49-4", "wave-49-5", "wave-49-6", "wave-49-7", "wave-49-8", "wave-49-9", "wave-49-10"
]

const stampAssets = []
const waveImages = new Array(2).fill(0)
let imageSlices = []
let glitchBlocks = []
let blackBlocks = []
let stamps = []

function preload() {
  //v.1 pick 3 files out of the entire pool
  for (let i = 0; i < waveImages.length; i++) {
    const rng = floor(random(waveAssets.length))
    const imageFile = `./assets/waves/${waveAssets[rng]}.png`
    waveAssets.splice(rng, 1) //ensure same asset doesn't get picked twice
    const img = loadImage(imageFile)
    waveImages[i] = img
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight).parent("canvas-bg")
  // background("#0000ff11")
  background(0)
  frameRate(6)
  renderBaseImage()
  //create a number of glitch strips
  glitchBlocks = generateGlitchBlocks(NUM_GLITCH_BLOCKS)
  blackBlocks = generateBlackBlocks(NUM_BLACK_BLOCKS)
  imageSlices = generateImageSlices(NUM_IMAGE_SLICES)

  // background(0)
  //render glitch blocks
  // console.log(imageSlices)
  // image(imageSlices[0].slice, 300, 300, 400, 400)
  // blackBlocks.forEach(block => renderBlackBlock(block))
  // glitchBlocks.forEach(block => renderGlitchBlock(block))
  // imageSlices.forEach(slice => renderImageSlice(slice))

  // background("#00000044")
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  background(0)
  renderBaseImage()
  glitchBlocks.forEach(block => renderGlitchBlock(block))
}

/*** RENDERING METHODS ***/
function renderBaseImage() {
  const [x, y, w, h] = getScaledRect(BASE_IMAGE_SCALE)
  waveImages.forEach(img => image(img, x, y, w, h))
}

function renderGlitchBlock({ strip, x, y, w, h }) {
  push()
  noSmooth()
  image(strip, x - w / 2, y - h / 2, w, h)
  pop()
}

function renderImageSlice({ slice, x, y, w, h }) {
  push()
  noSmooth()
  image(slice, x - w / 2, y - h / 2, w, h)
  pop()
}

function renderBlackBlock({ x, y, w, h }) {
  push()
  fill(0)
  noStroke()
  rect(x - w / 2, y - h / 2, w, h)
  pop()
}

/*** GENERATOR FUNCTIONS ***/

function generateGlitchBlocks(n = 10) {
  return new Array(n).fill(0).map(() => {
    const strip = getGlitchStrip()
    const [x, y] = getPointInFrame(...GLITCH_BLOCK_PLACEMENT_FRAME)
    const w = strip.width > strip.height ? strip.width : min(random(30, 200), random(30, 250))
    const h = strip.width < strip.height ? strip.height : min(random(30, 200), random(30, 250))
    return { strip, x, y, w, h }
  })
}

function getGlitchStrip() {
  //get a random point within the sample range
  const [xmin, xmax, ymin, ymax] = getSampleRange(GLITCH_SAMPLE_RANGE_SCALE)
  const sampleX = floor(random(xmin, xmax))
  const sampleY = floor(random(ymin, ymax))
  //determine sample alignment, width and height
  const stripPos = random() > 0.5 ? "horizontal" : "vertical"
  const stretchRange = floor(random(1, 5))
  // const stretchRange = 1;
  const mainRange = floor(random(30, 120))
  const sampleW = stripPos === "vertical" ?
    stretchRange :
    mainRange
  const sampleH = stripPos === "horizontal" ?
    stretchRange :
    mainRange
  //pull a sample from the image
  return get(sampleX, sampleY, sampleW, sampleH)
}

function generateImageSlices(n = 10) {
  return new Array(n).fill(0).map(() => {
    const slice = getImageSlice()
    const [x, y] = getPointInFrame(...IMAGE_SLICE_PLACEMENT_FRAME)
    return {slice, x, y, w: slice.width * 2, h: slice.height * 2}
  })
}

function getImageSlice() {
  const [xmin, xmax, ymin, ymax] = getSampleRange(IMAGE_SLICE_RANGE_SCALE)
  const sampleX = floor(random(xmin, xmax))
  const sampleY = floor(random(ymin, ymax))
  // const sampleW = 400;
  // const sampleH = 400;
  const sampleW = floor(random(30, 60)) //change these later
  const sampleH = floor(random(30, 60)) //change these later
  return get(sampleX, sampleY, sampleW, sampleH)
}

function generateBlackBlocks(n = 10) {
  return new Array(n).fill(0).map(() => {
    const [x, y] = getPointInFrame(...BLACK_BLOCK_PLACEMENT_FRAME)
    const blockAlignment = random() > 0.5 ? "horizontal" : "vertical"
    const w = blockAlignment === "horizontal" ? floor(random(150, 300)) : floor(random(5, 60))
    const h = blockAlignment === "vertical" ? floor(random(150, 300)) : floor(random(5, 60))
    return { x, y, w, h }
  })
}

function generateStamps() {

}

/*** HELPER FUNCTIONS ***/
function getScaledRect(scale) {
  const margin = (1 - scale) / 2; //horizontal margin
  const w = windowWidth * scale;
  const h = w * 0.5625; //16:9 aspect ratio
  const x = windowWidth * margin;
  const y = (windowHeight - h) / 2;
  return [x, y, w, h]
}

function getSampleRange(scale) {
  const [x, y, w, h] = getScaledRect(scale)
  return [x, x + w, y, y + h]
}

function getPointInFrame(outerScale, innerScale) {
  const [x1, y1, w1, h1] = getScaledRect(outerScale)
  const [x2, y2, w2, h2] = getScaledRect(innerScale)

  const ranges = [
    { xmin: x1, xmax: x2, ymin: y1, ymax: y1 + h1 },
    { xmin: x2 + w2, xmax: x1 + w1, ymin: y1, ymax: y1 + h1 },
    { xmin: x2, xmax: x2 + w2, ymin: y1, ymax: y2 },
    { xmin: x2, xmax: x2 + w2, ymin: y1 + h1, ymax: y2 + h2 }
  ]

  const range = ranges[floor(random(ranges.length))]
  const x = floor(random(range.xmin, range.xmax));
  const y = floor(random(range.ymin, range.ymax));
  return [x, y]

}