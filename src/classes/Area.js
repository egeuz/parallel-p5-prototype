class Area {
  constructor( outerLimit, innerLimit, source ) {
    this.baseW = source ? source.width : width
    this.baseH = source ? source.height : height
    this.outerLimit = outerLimit;
    this.innerLimit = innerLimit;
    this.areas;
  }

  init() {
    this.setAreas();
    return this;
  }

  resize() {
    this.setAreas()
  }

  setAreas() {
    if (!this.innerLimit) {
      const [x, y, w, h] = this.getScaledRect(this.outerLimit)
      this.areas = [
        { xmin: x, xmax: x + w, ymin: y, ymax: y + h }
      ]
    } else {
      //facilitate a frame-like selection area
      const [x1, y1, w1, h1] = this.getScaledRect(this.outerLimit)
      const [x2, y2, w2, h2] = this.getScaledRect(this.innerLimit)
      this.areas = [
        { xmin: x1, xmax: x2, ymin: y1, ymax: y1 + h1 },
        { xmin: x2 + w2, xmax: x1 + w1, ymin: y1, ymax: y1 + h1 },
        { xmin: x2, xmax: x2 + w2, ymin: y1, ymax: y2 },
        { xmin: x2, xmax: x2 + w2, ymin: y1 + h1, ymax: y2 + h2 }
      ]
    }
  }

  getRandomPoint() {
    const range = this.areas.length > 1 ?
      this.areas[floor(random(this.areas.length))] :
      this.areas[0]
    const x = floor(random(range.xmin, range.xmax))
    const y = floor(random(range.ymin, range.ymax))
    return createVector(x, y)
  }

  getScaledRect(scale) {
    const margin = (1 - scale) / 2; //horizontal margin
    const w = this.baseW * scale;
    const h = w * 1.78; //16:9 aspect ratio -- 0.5625 for horizontal image
    const x = this.baseW * margin;
    const y = (this.baseH - h) / 2;
    return [x, y, w, h]
  }
}