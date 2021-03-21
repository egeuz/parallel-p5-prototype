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
    let pos = this.generateRenderPosition()
    this.position = pos;
    this.originalPos = pos;
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

  resize() {
    // this.sampleArea.resize()
    this.placementArea.resize()
    let newMinSize = width * this.minSizeRatio
    let newMaxSize = width * this.maxSizeRato * 0.5625

    // this.minSize = width * this.minSizeRatio
    // this.maxSize = width * this.maxSizeRatio
  }

  glitchOut() {
    let minOffset = 5;
    let maxOffset = 15;
    let x = this.originalPos.x + random(minOffset, maxOffset) * floor(random(-1, 2))
    let y = this.originalPos.y + random(minOffset, maxOffset) * floor(random(-1, 2))
    this.position = createVector(x, y)
  }

  snapBack() {
    this.position = this.originalPos;
  }
}
