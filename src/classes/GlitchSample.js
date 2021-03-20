class GlitchSample extends GlitchBlock {
  constructor (config) {
    super(config)
    this.sampleImage = config.sampleImage;
    this.sampleArea = config.sampleArea;
    this.sample;
  }

  init() {
    this.sample = this.generateSample()
    this.position = this.generateRenderPosition()
    this.size = this.generateRenderSize()
    return this;
  }

  generateSample() {
    const {x, y} = this.generateSamplePosition();
    const {w, h} = this.generateSampleSize();
    this.sampledAreaTester = [x, y, w, h]
    return get(x, y, w, h);
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