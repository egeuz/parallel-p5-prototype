let pattern;
function setup() {
  createCanvas(windowWidth, windowHeight)
  pattern = new PatternTest(
    createVector(300, 300),
    { w: 150, h: 150 },
    "#f9578a",
    "#121212"
  ).init()
}

function draw() {
  pattern.render()
}

class PatternTest {

  constructor(position, size, c, bg) {
    this.position = position
    this.size = size
    this.color = c
    this.bgColor = bg
    this.patternTypes = [
      "strokedCheckers",
      "checkers",
      "barcode",
    ]
    this.pattern = random(this.patternTypes)
    this.renders = []
  }

  init() {
    const { x, y } = this.position;
    const { w, h } = this.size;
    if (this[`${this.pattern}Init`]) {
      this[`${this.pattern}Init`](x, y, w, h, this.color, this.bgColor)
    }
    return this;
  }

  render() {
    const { x, y } = this.position;
    const { w, h } = this.size;
    this[this.pattern](x, y, w, h, this.color, this.bgColor)
  }

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
        fill(color)
        noStroke()
        rect(x + blockW, y, blockW, blockH)
        rect(x + 5 * blockW, y, blockW, blockH)
        rect(x + w - 6 * blockW, y, blockW, blockH)
        rect(x + w - 2 * blockW, y, blockW, blockH)
        pop()
      }

      function drawRowType2(y) {
        fill(c)
        noStroke()
        rect(x, y, w, blockH)
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