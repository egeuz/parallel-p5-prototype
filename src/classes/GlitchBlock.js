class GlitchBlock {
  constructor({
    renderArea,
    minSizeRatio,
    maxSizeRatio,
    shape
  }) {
    /*** operational properies ***/
    this.renderArea = renderArea;
    this.minSizeRatio = minSizeRatio;
    this.maxSizeRatio = maxSizeRatio;
    this.shape = shape;
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
    console.log(this.originalPos);
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
    fill(0)
    noStroke()
    rect(x, y, w, h)
    pop()
  }

  resize() {
    this.sampleArea.resize()
    this.placementArea.resize()
    let newMinSize = width * this.minSizeRatio
    let newMaxSize = width * this.maxSizeRato * 0.5625

    // this.minSize = width * this.minSizeRatio
    // this.maxSize = width * this.maxSizeRatio
  }

  glitchOut() {
    this.position = this.generateRenderPosition()
  }

  snapBack() {
    // console.log(this.originalPos)
    this.position = this.originalPos;
  }
}
