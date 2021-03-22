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
