//BASE CLASS — GLITCH BLOCK
//handles positioning, sampling & basic animations for all glitch elements




class GlitchBlock extends GlitchStrip {
  constructor(opts) {
    super(opts)
    this.minSampleRatio = opts.minSampleRatio;
    this.maxSampleRatio = opts.maxSampleRatio;
    this.minSampleSize = width * opts.minSampleRatio;
    this.maxSampleSize = width * opts.maxSampleRatio;
  }

  generateRenderShape() {
    //get point to start sample from
    const [sampleX, sampleY] = this.sampleArea.getRandomPoint()
    //generate the shape of the sample
    const [sampleW, sampleH] = this.generateSampleShape()
    this.sample = this.sampleImage.get(sampleX, sampleY, sampleW, sampleH);
    this.w = this.getRandomSize()
    this.h = this.getRandomSize()
    const [x, y] = this.placementArea.getRandomPoint()
    this.x = x;
    this.y = y;
    return this
  }

  generateSampleShape() {
    const w = floor(random(this.minSampleSize, this.maxSampleSize))
    const h = floor(random(this.minSampleSize, this.maxSampleSize))
    return [w, h]
  }
}