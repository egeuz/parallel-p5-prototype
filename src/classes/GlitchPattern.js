class GlitchPattern extends GlitchBlock {
  constructor(config) {
    super(config)
  }

  render() {
    const {x, y} = this.position;
    const {w, h} = this.size;
    push()
    fill(255, 0, 0)
    noStroke()
    rect(x, y, w, h)
    pop()
  }
}