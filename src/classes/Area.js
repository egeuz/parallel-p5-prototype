class Area {
  constructor(outerLimit, innerLimit) {
    this.outerLimit = outerLimit;
    this.innerLimit = innerLimit;
    this.areas;

    //initialize area
    if (!innerLimit) {
      const [x, y, w, h] = getScaledRect(outerLimit)
      this.areas = [
        { xmin: x, xmax: x + w, ymin: y, ymax: y + h }
      ]
    } else {
      //facilitate a frame-like selection area
      const [x1, y1, w1, h1] = getScaledRect(outerLimit)
      const [x2, y2, w2, h2] = getScaledRect(innerLimit)
      this.areas = [
        { xmin: x1, xmax: x2, ymin: y1, ymax: y1 + h1 },
        { xmin: x2 + w2, xmax: x1 + w1, ymin: y1, ymax: y1 + h1 },
        { xmin: x2, xmax: x2 + w2, ymin: y1, ymax: y2 },
        { xmin: x2, xmax: x2 + w2, ymin: y1 + h1, ymax: y2 + h2 }
      ]
    }
  }

  resetAreas() {
    if (!this.innerLimit) {
      const [x, y, w, h] = getScaledRect(this.outerLimit)
      this.areas = [
        { xmin: x, xmax: x + w, ymin: y, ymax: y + h }
      ]
    } else {
      //facilitate a frame-like selection area
      const [x1, y1, w1, h1] = getScaledRect(this.outerLimit)
      const [x2, y2, w2, h2] = getScaledRect(this.innerLimit)
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

  resize() {
    this.resetAreas()
  }

  render() {
    //test purposes only
    this.areas.forEach(area => {
      push()
      rectMode(CORNER)
      fill("#ffffff88");
      rect(area.xmin, area.ymin, area.xmax - area.xmin, area.ymax - area.ymin)
      pop()
    })

    return this;
  }
}

/*** HELPER METHODS ***/
function getScaledRect(scale) {
  const margin = (1 - scale) / 2; //horizontal margin
  const w = width * scale;
  const h = w * 0.5625; //16:9 aspect ratio
  const x = width * margin;
  const y = (height - h) / 2;
  return [x, y, w, h]
}