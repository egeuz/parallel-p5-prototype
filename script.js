/************************/
/*** JAVASCRIPT SETUP ***/
/************************/
//remove these for production
document.body.style.margin = 0; 
document.body.style.height = "1000vh";
//end remove

const RESPONSIVE_BREAKPOINT = 500;

//generate the canvas element within our javascript aww yeah
const canvasBG = document.createElement("div")
canvasBG.style.width = "100vw";
canvasBG.style.height = "100vh";
canvasBG.style.position = "fixed";
canvasBG.style.zIndex = "-1";
canvasBG.style.top = "0";
canvasBG.style.left = "0";
canvasBG.id = "canvas-bg";

//do responsive shit here as well bc we're not doing css either
canvasBG.style.display = window.innerWidth < RESPONSIVE_BREAKPOINT ? "none" : "block"
window.addEventListener("resize", e => {
  canvasBG.style.display = window.innerWidth < RESPONSIVE_BREAKPOINT ? "none" : "block"
})

//set up preloading screen
const preloadBG = document.createElement("div")
preloadBG.style.backgroundColor = "#000";
preloadBG.style.id = "p5_loading";

document.body.appendChild(canvasBG)
document.body.appendChild(preloadBG)

/******************/
/*** P5 RUNTIME ***/
/******************/
const waveAssets = [
  "wave-10-1", "wave-10-2", "wave-10-3", "wave-10-4", "wave-10-5", "wave-10-6", "wave-10-7", "wave-10-8", "wave-10-9", "wave-10-10", "wave-23-1", "wave-23-2",
  "wave-23-3", "wave-23-4", "wave-23-5", "wave-23-6", "wave-23-7", "wave-23-8",
  "wave-23-9", "wave-23-10", "wave-36-1", "wave-36-2", "wave-36-3", "wave-36-4", "wave-36-5", "wave-36-6", "wave-36-7", "wave-36-8", "wave-36-9", "wave-36-10", 
  "wave-49-1", "wave-49-2", "wave-49-3", "wave-49-4", "wave-49-5", "wave-49-6", "wave-49-7", "wave-49-8", "wave-49-9", "wave-49-10"
]

const images = []
const numOverlays = 3;

function preload() {
  //pick 3 files
  for (let i = 0; i < numOverlays; i++)  {
    const rng = floor(random(waveAssets.length))
    const img = loadImage(`./assets/waves/${waveAssets[rng]}.png`)
    images.push(img)
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight).parent("canvas-bg")
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}

function draw() {
  background(0)
  images.forEach(img => {
    image(img,
      width * 0.075, 
      height * 0.075, 
      width - (width * 0.15), 
      height - (height * 0.15)
      )
  })
}