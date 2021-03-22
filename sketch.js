/*****************/
/*** DOM SETUP ***/
/*****************/
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
document.getElementById("left-col").appendChild(canvas)
/******END DOM SETUP ******/


/******************/
/*** P5 RUNTIME ***/
/******************/
//base image variables
const ASPECT_RATIO = 1.78; //0.5625
const BASE_IMAGE_FILE = "./assets/base_image.png"
let BASE_IMAGE_DATA; //will contain p5.Image
let BASE_IMAGE; //will contain BaseImage instance

//glitch block generation vars
const NUM_STRIPS = 8;
const NUM_HIGH_RES_FRAGMENTS = 15;
const NUM_LOW_RES_FRAGMENTS = 15;
const NUM_BLACKOUTS = 16;
const sampleBlocks = []
const blackoutBlocks = []

function preload() {
  BASE_IMAGE_DATA = loadImage(BASE_IMAGE_FILE)
}

function setup() {
  frameRate(24)
  rectMode(CENTER)
  imageMode(CENTER)

  const w = document.getElementById("canvas-bg").clientWidth
  createCanvas(w, w * ASPECT_RATIO)
    .parent("canvas-bg")

  BASE_IMAGE = new BaseImage(BASE_IMAGE_DATA, 0.95)
  generateSamples()
  generateBlackouts()

  window.addEventListener("scroll", () => { if (random() < 0.55) glitchOut() })
}

function windowResized() {
  const w = document.getElementById("canvas-bg").clientWidth
  resizeCanvas(w, w * ASPECT_RATIO)
  BASE_IMAGE.resize()
  sampleBlocks.forEach(block => {
    block.resize()
  })
  blackoutBlocks.forEach(block => {
    block.resize()
  })
}

function draw() {
  clear()
  BASE_IMAGE.render()
  blackoutBlocks.forEach(block => block.render())
  sampleBlocks.forEach(block => block.render())

  if (noise(frameCount) < 0.25) glitchOut()
}

function mouseMoved() {
  if (random() < 0.85) glitchOut()
}

/*** END P5 RUNTIME ***/

/************************/
/*** HELPER FUNCTIONS ***/
/************************/

function generateSamples() {
  for (let i = 0; i < NUM_STRIPS; i++) {
    const strip = new GlitchStrip({
      sampleImage: BASE_IMAGE_DATA,
      sampleArea: new Area(1, 0.01, BASE_IMAGE_DATA).init(),
      renderArea: new Area(0.8).init(),
      minSizeRatio: 0.04 * 1.5, //0.04
      maxSizeRatio: 0.017 * 1.5 //0.017
    }).init()
    sampleBlocks.push(strip)
  }

  for (let i = 0; i < NUM_HIGH_RES_FRAGMENTS; i++) {
    const fragment = new GlitchFragment({
      sampleImage: BASE_IMAGE_DATA,
      sampleArea: new Area(1, 0.1, BASE_IMAGE_DATA).init(),
      renderArea: new Area(0.8).init(),
      minSizeRatio: 0.09 * 1.5,
      maxSizeRatio: 0.16 * 1.5,
      minSampleRatio: 0.2,
      maxSampleRatio: 0.25
    }).init()
    sampleBlocks.push(fragment)
  }

  for (let i = 0; i < NUM_LOW_RES_FRAGMENTS; i++) {
    const fragment = new GlitchFragment({
      sampleImage: BASE_IMAGE_DATA,
      sampleArea: new Area(1, 0.4, BASE_IMAGE_DATA).init(),
      renderArea: new Area(0.8).init(),
      minSizeRatio: 0.04 * 1.5,
      maxSizeRatio: 0.07 * 1.5,
      minSampleRatio: 0.1,
      maxSampleRatio: 0.15
    }).init()
    sampleBlocks.push(fragment)
  }

  shuffle(sampleBlocks)
}

function generateBlackouts() {
  for (let i = 0; i < NUM_BLACKOUTS; i++) {
    const fragment = new GlitchBlock({
      renderArea: new Area(0.85, 0.6).init(),
      minSizeRatio: 0.1,
      maxSizeRatio: 0.24
    }).init()

    blackoutBlocks.push(fragment)
  }
}

function glitchOut() {
  sampleBlocks.forEach(block => { if (random() < 0.3) block.glitchOut() })
  blackoutBlocks.forEach(block => { if (random() < 0.5) block.init() })
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/*** END HELPER FUNCTIONS ***/

/***************/
/*** CLASSES ***/
/***************/
class Area {
  constructor(outerLimit, innerLimit, source) {
    this.baseW = source ? source.width : width
    this.baseH = source ? source.height : height
    this.outerLimit = outerLimit;
    this.innerLimit = innerLimit;
    this.areas;
  }

  init() {
    this.setAreas();
    return this;
  }

  resize() {
    this.setAreas()
  }

  setAreas() {
    if (!this.innerLimit) {
      const [x, y, w, h] = this.getScaledRect(this.outerLimit)
      this.areas = [
        { xmin: x, xmax: x + w, ymin: y, ymax: y + h }
      ]
    } else {
      //facilitate a frame-like selection area
      const [x1, y1, w1, h1] = this.getScaledRect(this.outerLimit)
      const [x2, y2, w2, h2] = this.getScaledRect(this.innerLimit)
      this.areas = [
        { xmin: x1, xmax: x2, ymin: y1, ymax: y1 + h1 },
        { xmin: x2 + w2, xmax: x1 + w1, ymin: y1, ymax: y1 + h1 },
        { xmin: x2, xmax: x2 + w2, ymin: y1, ymax: y2 },
        { xmin: x2, xmax: x2 + w2, ymin: y1 + h1, ymax: y2 + h2 }
      ]
    }
  }

  getRandomPoint() {
    const range = this.areas.length > 1 ?
      this.areas[floor(random(this.areas.length))] :
      this.areas[0]
    const x = floor(random(range.xmin, range.xmax))
    const y = floor(random(range.ymin, range.ymax))
    return createVector(x, y)
  }

  getScaledRect(scale) {
    const margin = (1 - scale) / 2; //horizontal margin
    const w = this.baseW * scale;
    const h = w * 1.78; //16:9 aspect ratio -- 0.5625 for horizontal image
    const x = this.baseW * margin;
    const y = (this.baseH - h) / 2;
    return [x, y, w, h]
  }
}

class GlitchBlock {
  constructor({
    renderArea,
    minSizeRatio,
    maxSizeRatio,
  }) {
    /*** operational properies ***/
    this.renderArea = renderArea;
    this.minSizeRatio = minSizeRatio;
    this.maxSizeRatio = maxSizeRatio;
    this.minSize = width * minSizeRatio;
    this.maxSize = width * maxSizeRatio;
    /*** render properties ***/
    this.size;
    this.position;
    this.originalPos;
  }

  init() {
    this.position = this.generateRenderPosition()
    this.size = this.generateRenderSize()
    return this;
  }

  generateRenderPosition() {
    return this.renderArea.getRandomPoint()
  }

  generateRenderSize() {
    return {
      w: this.getRandomSize(),
      h: this.getRandomSize()
    }
  }

  getRandomSize() {
    return floor(random(this.minSize, this.maxSize))
  }

  render() {
    const {x, y} = this.position;
    const {w, h} = this.size;
    push()
    fill("#121212")
    noStroke()
    rect(x, y, w, h)
    pop()
  }

  resize(w) {
    this.renderArea.resize()
    let newMinSize = width * this.minSizeRatio
    let newMaxSize = width * this.maxSizeRatio
    this.minSize = newMinSize;
    this.maxSize = newMaxSize;
    this.init()
  }

  snapBack() {
    this.position = this.originalPos;
  }
}

class GlitchSample extends GlitchBlock {
  constructor (config) {
    super(config)
    this.sampleImage = config.sampleImage;
    this.sampleArea = config.sampleArea;
    this.sample;
  }

  init() {
    this.sample = this.generateSample()
    let pos = this.generateRenderPosition()
    this.position = pos;
    this.originalPos = pos;
    this.size = this.generateRenderSize()
    return this;
  }

  generateSample() {
    const {x, y} = this.generateSamplePosition();
    const {w, h} = this.generateSampleSize();
    this.sampledAreaTester = [x, y, w, h]
    return this.sampleImage.get(x, y, w, h);
  }

  generateSamplePosition() {
    return this.sampleArea.getRandomPoint()
  }

  generateSampleSize() {
    return {
      w: this.getRandomSize(),
      h: this.getRandomSize() * 1.78
    }
  }

  glitchOut() {
    let minOffset = 15;
    let maxOffset = 45;
    let x = this.originalPos.x + random(minOffset, maxOffset) * floor(random(-1, 2))
    let y = this.originalPos.y + random(minOffset, maxOffset) * floor(random(-1, 2))
    this.position = createVector(x, y)
    if (random() < 0.4) this.sample = this.generateSample()
  }

  render() {
    const {x, y} = this.position;
    const {w, h} = this.size;
    push()
    noSmooth()
    image(this.sample, x, y, w, h)
    pop()
  }
}

class GlitchStrip extends GlitchSample {
  constructor(config) {
    super(config)
  }

  generateSampleSize() {
    const stripDir = random() > 0.5 ?
      "horizontal" :
      "vertical"
    if (stripDir === "horizontal") {
      return {
        w: floor(random(5, 10)),
        h: this.getRandomSize()
      }
    } else {
      return {
        w: this.getRandomSize(),
        h: floor(random(5, 10))
      }
    }
  }

  generateRenderSize() {
    const sw = this.sample.width;
    const sh = this.sample.height;
    return {
      w: sw > sh ? sw : this.getRandomSize(),
      h: sh > sw ? sh : this.getRandomSize()
    }
  }
}

class GlitchFragment extends GlitchSample {

  constructor(config) {
    super(config)
    this.minSampleRatio = config.minSampleRatio
    this.maxSampleRatio = config.maxSampleRatio
    this.minSampleSize = width * config.minSampleRatio;
    this.maxSampleSize = width * config.maxSampleRatio;
  }

  generateSampleSize() {
    return {
      w: floor(random(this.minSampleSize, this.maxSampleSize)),
      h: floor(random(this.minSampleSize, this.maxSampleSize)) * 1.78
    }
  }
}

class BaseImage {
  constructor(img, scale) {
    this.image = img;
    this.x = width / 2;
    this.y = height / 2;
    this.w = width * scale;
    this.h = height * scale;
    this.scale = scale;
  }

  render() {
    image(this.image, this.x, this.y, this.w, this.h)
  }

  resize() {
    this.x = width / 2;
    this.y = height / 2;
    this.w = width * this.scale;
    this.h = height * this.scale;
  }
}

/*** END CLASSES ***/