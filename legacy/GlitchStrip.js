class GlitchStrip {
  constructor({
    sampleImage,
    sampleArea,
    placementArea,
    minRatio,
    maxRatio,
    shape //string enum, will add logic for this later
  }) {
    /*** setup vars ***/
    this.sampleImage = sampleImage;
    this.sampleArea = sampleArea;
    this.placementArea = placementArea;
    this.minRatio = minRatio;
    this.maxRatio = maxRatio;
    this.minSize = width * minRatio;
    this.maxSize = width * maxRatio;
    this.shape = shape;
    /*** operational vars ***/
    this.sample; //operational var for the sample taken
    this.x;
    this.y;
    this.w;
    this.h;
  }

  generateRenderShape() {
    //get point to start sample from
    const [sampleX, sampleY] = this.sampleArea.getRandomPoint()
    //generate the shape of the sample
    const [sampleW, sampleH] = this.generateSampleShape()
    //take the sample
    this.sample = this.sampleImage.get(sampleX, sampleY, sampleW, sampleH);
    //set the render properties
    this.w = (sampleW > sampleH) ? sampleW : this.getRandomSize()
    this.h = (sampleH > sampleW) ? sampleH : this.getRandomSize()
    const [x, y] = this.placementArea.getRandomPoint()
    this.x = x;
    this.y = y;
    return this;
  }

  generateSampleShape() {
    //randomly generate a direction for the strip
    /*** [!] replace this with some logic using this.shape later ***/
    const stripDirection = random() > 0.5 ? "horizontal" : "vertical"
    let w = stripDirection === "horizontal" ?
      floor(random(1, 5)) :
      this.getRandomSize()
    let h = stripDirection === "vertical" ?
      floor(random(1, 5)) :
      this.getRandomSize() * 0.5625; //aspect ratio!
    return [w, h]
  }

  getRandomSize() {
    return floor(random(this.minSize, this.maxSize))
  }

  render() {
    push()
    noSmooth()
    image(this.sample, this.x, this.y, this.w, this.h)
    pop()
  }

  resize() {
    this.sampleArea.resize()
    this.placementArea.resize()
    this.minSize = width * this.minRatio
    this.maxSize = width * this.maxRatio
    this.generateRenderShape()
  }
}