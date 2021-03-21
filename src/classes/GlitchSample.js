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
      h: this.getRandomSize() * 0.5625
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
    // fill("#fff7")
    // noStroke()
    // rect(...this.sampledAreaTester)
    pop()
  }
}