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