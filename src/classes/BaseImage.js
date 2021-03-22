class BaseImage {
  constructor(img, scale) {
    this.image = img;
    this.x = width / 2;
    this.y = height / 2;
    this.w = width * scale;
    this.h = height * scale;
    // this.w = height * scale * 0.5625;
    // this.h = height * scale;
    // this.h = width * scale * 1.78; //preserve aspect ratio
    this.scale = scale;
  }

  render() {
    image(this.image, this.x, this.y, this.w, this.h)
  }

  resize() {
    this.x = width / 2;
    this.y = height / 2;
    this.w = width * this.scale;
    this.h = height * this.scale;
    // this.h = height * this.scale * 1.78;
    // this.h = width * this.scale * 0.5625;
  }
}