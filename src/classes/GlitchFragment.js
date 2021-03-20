class GlitchFragment extends GlitchSample {

  constructor(config) {
    super(config)
    this.minSampleRatio = config.minSampleRatio
    this.maxSampleRatio = config.maxSampleRatio
    this.minSampleSize = width * config.minSampleRatio;
    this.maxSampleSize = width * config.maxSampleRatio;
  }

  generateSampleSize() {

    // console.log(this.minSampleSize, this.maxSampleSize)
    return {
      w: floor(random(this.minSampleSize, this.maxSampleSize)),
      h: floor(random(this.minSampleSize, this.maxSampleSize)) * 0.5625
    }
  }
}