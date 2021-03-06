class GlitchPattern extends GlitchBlock {
  constructor(config) {
    super(config)
    this.sampleArea = config.sampleArea;

    this.bgColor = "#00000000" //transparent
    /*** pattern properties ***/
    this.colors = [
      "#985948",
      "#8f2fda",
      "#DD6432",
      "#091734",
      "#31569C"
    ]
    this.patternTypes = [
      "strokedCheckers",
      "checkers",
      "barcode",
    ]
    this.color = random(this.colors);
    this.pattern = random(this.patternTypes)
    this.renders = []
  }

  init() {
    let pos = this.generateRenderPosition()
    this.position = pos;
    this.originalPos = pos;
    this.size = this.generateRenderSize()
    // this.initColor()
    this.initPattern()
    return this;
  }

  initColor() {
    let {x, y} = this.sampleArea.getRandomPoint()
    let [r, g, b] = get(x, y)
    this.color = color(r, g, b)
  }

  initPattern() {
    const { x, y } = this.position;
    const { w, h } = this.size;
    if (this[`${this.pattern}Init`]) {
      this[`${this.pattern}Init`](x, y, w, h, this.color, this.bgColor)
    }
  }

  render() {
    const { x, y } = this.position;
    const { w, h } = this.size;
    this[this.pattern](x, y, w, h, this.color, this.bgColor)
  }

  glitchOut() {
    let minOffset = 25;
    let maxOffset = 75;
    let x = this.originalPos.x + random(minOffset, maxOffset) * floor(random(-1, 2))
    let y = this.originalPos.y + random(minOffset, maxOffset) * floor(random(-1, 2))
    this.position = createVector(x, y)
    this.initPattern()
  }

  /***********************/
  /*** PATTERN METHODS ***/
  /*** get ready, this ***/
  /***** is gonna be *****/
  /**** a long journey ***/

  strokedCheckers(x, y, w, h, c, bgc) {
    const res = 14;
    const blockW = w / res;
    const blockH = h / res;

    noStroke()
    for (let i = 0; i < res; i++) {
      if (i === 1 || i === 5 || i === 8 || i === 12) {
        drawRowType2(y + i * blockH)
      } else {
        drawRowType1(y + i * blockH, this.color)
      }

      function drawRowType1(y, color) {
        push()
        // rectMode(CORNER)
        fill(color)
        noStroke()
        rect(x + blockW, y, blockW, blockH)
        rect(x + 5 * blockW, y, blockW, blockH)
        rect(x + 8 * blockW, y, blockW, blockH)
        rect(x + 12 * blockW, y, blockW, blockH)
        pop()
      }

      function drawRowType2(y) {
        fill(c)
        noStroke()
        rect(x + 6.5 * blockW, y, w, blockH)
        drawRowType1(y, bgc)
      }
    }
  }

  checkers(x, y, w, h) {
    const res = 10;
    const blockW = w / res;
    const blockH = h / res;

    noStroke();
    for (let row = 0; row < res; row++) {
      for (let col = 0; col < res; col++) {
        let fillC = (row + col) % 2 === 0 ? this.color : this.bgColor;
        fill(fillC)
        rect(x + blockW * col, y + blockH * row, blockW, blockH)
      }
    }
  }

  barcodeInit(x, y, w, h) {
    this.renders = []
    const minStripW = w * 0.04;
    const maxStripW = w * 0.15;
    let totalW = 0;
    let steps = 0;

    while (totalW < w) {
      let fill = steps % 2 === 0 ? this.color : this.bgColor;
      let mod = steps % 2 === 0 ? 0.65 : 0.25
      let stripW = random() > mod ?
        max(random(minStripW, maxStripW), random(minStripW, maxStripW)) :
        minStripW

      this.renders.push({
        x: x + totalW,
        y: y,
        w: stripW,
        h: h,
        fill: fill
      })
      totalW += stripW;
      steps++;
    }
  }

  barcode() {
    this.renders.forEach(r => {
      fill(r.fill)
      rect(r.x, r.y, r.w, r.h)
    })
  }
}