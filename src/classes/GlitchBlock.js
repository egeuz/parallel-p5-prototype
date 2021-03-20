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
    fill(0)
    noStroke()
    rect(x, y, w, h)
    pop()
  }
}
