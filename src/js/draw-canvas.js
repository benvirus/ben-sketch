import Component from 'ben-component';
import DataCanvas from 'ben-canvas';
import TextTool from './text-tool';

const LINE = 'line';
const RECT = 'rect';
const TEXT = 'text';
const EASE = 'ease';
const ELLIPSE = 'ellipse';
const tools = [LINE, RECT, TEXT, EASE, ELLIPSE];

const COLOR_RED = '#f00';
const COLOR_DEFAULT = COLOR_RED;

class DrawCavans extends Component {
  constructor(parent, options) {
    super(parent, options);
    this.color = COLOR_DEFAULT;
    this.initEvent();
  }

  createEl() {
    const el = super.createEl('canvas', {
      width: this.options.width,
      height: this.options.height,
      style: 'display: block; height: this.options.height / this.options.screenDpr; width: this.options.width / this.options.screenDpr;'
    }, {
      className: 'ben-sketch_canvas-draw'
    });
    this.ctx = el.getContext('2d');
    return el;
  }

  initEvent() {
    this.on('mousedown', (e) => {
      if (e.buttons && e.buttons !== 1) {
        return;
      }
      if (e.button !== 0) {
        return;
      }
      this[`${this.tool}MousedownListener`] && this[`${this.tool}MousedownListener`](e);
    });

    this.on('mouseup', (e) => {
      if (e.buttons && e.buttons !== 1) {
        return;
      }
      if (e.button !== 0) {
        return;
      }
      if (this.tool === 'text') {
        this[`${TEXT}MouseupListener`](e);
      }
    })
  }

  [`${LINE}MousedownListener`](e) {
    const ctx = this.ctx;
    console.log(LINE, 'mousedown', this.color);
    const linePoints = [];
    linePoints.push({
      x: this.getComputedDprSize(e.offsetX / this.el.width),
      y: this.getComputedDprSize(e.offsetY / this.el.height)
    });
    const ommousemove = (event) => {
      DataCanvas.clear(this.ctx);
      linePoints.push({
        x: this.getComputedDprSize(event.offsetX / this.el.width),
        y: this.getComputedDprSize(event.offsetY / this.el.height)
      });
      DataCanvas.line(ctx, {
        color: this.color,
        points: linePoints
      });
    }
    const offmousemove = () => {
      DataCanvas.clear(ctx);
      this.trigger('line.submit', {
        points: linePoints,
        color: this.color
      });
      this.off('mousemove');
      this.off('mouseup', offmousemove);
      this.off('mouseleave', offmousemove);
    }
    this.on('mousemove', ommousemove);
    this.on('mouseup', offmousemove);
    this.on('mouseleave', offmousemove);
  }

  [`${RECT}MousedownListener`](event) {
    console.log(RECT, 'mousedown');
    const ctx = this.ctx;
    // store the start position of the rect.
    const x = event.offsetX, y = event.offsetY;
    const rectData = {
      position: {
        x: this.getComputedDprSize(x / this.el.width),
        y: this.getComputedDprSize(y / this.el.height)
      },
      color: this.color
    }
    // create temp canvas for preview rect in real-time.
    ctx.strokeStyle = this.color;

    const onmousemove = (e) => {
      // clear previous rect.
      DataCanvas.clear(this.ctx);
      // get the current rect width and height;
      const width = e.offsetX - x,
        height = e.offsetY - y;
      // store the width and height of current rect in ratio of canvas demension.
      rectData.width = this.getComputedDprSize(width / this.el.width);
      rectData.height = this.getComputedDprSize(height / this.el.height);
      // draw the current rect to temp canvas for preview.
      this.ctx.strokeRect(this.getComputedDprSize(x), this.getComputedDprSize(y), this.getComputedDprSize(width), this.getComputedDprSize(height));
    }

    const offmousemove = () => {
      DataCanvas.clear(this.ctx);
      this.trigger('rect.submit', rectData);
      this.off('mousemove');
      this.off('mouseup', offmousemove);
      this.off('mouseleave', offmousemove);
    }

    this.on('mousemove', onmousemove);
    this.on('mouseup', offmousemove);
    this.on('mouseleave', offmousemove);
  }

  [`${TEXT}MousedownListener`](e) {

  }

  [`${TEXT}MouseupListener`](e) {
    console.log(TEXT, 'mouseup');
    if (this.textTool) {
      this.textTool = null;
      return;
    }
    const x = e.offsetX,
      y = e.offsetY - 8;
    const textPoints = [];
    textPoints.push({x, y});
    const textTool = this.textTool = new TextTool(this.parent.el, {
      x,
      y,
      size: this.options.textSize,
      lineHeight: this.options.textLineHeight,
      color: this.color
    });
    textTool.on('valuechange', (event, data) => {
      this.parent.measureEl.innerHTML = data + '  ';
      textTool.width(this.parent.measureEl.clientWidth);
      textTool.height(this.parent.measureEl.clientHeight);
    });
    textTool.on('submit', (event, data) => {
      if (!data.data) {
        return;
      }
      const textOptions = {
        position: {
          x: this.getComputedDprSize(x / this.el.width),
          y: this.getComputedDprSize(y / this.el.height)
        },
        color: this.color,
        text: data.data,
        size: data.size,
        lineHeight: data.lineHeight * data.size
      }
      this.trigger('text.submit', textOptions);
    });
  }

  [`${EASE}MousedownListener`](e) {
    console.log(EASE, 'mousedown');
    const easePoints = [];
    easePoints.push({
      x: this.getComputedDprSize(e.offsetX / this.el.width),
      y: this.getComputedDprSize(e.offsetY / this.el.height)
    });
    const mousemove = (e) => {
      easePoints.push({
        x: this.getComputedDprSize(e.offsetX / this.el.width),
        y: this.getComputedDprSize(e.offsetY / this.el.height)
      });
      DataCanvas.ease(this.parent.ctx, {
        points: easePoints,
        lineWidth: 20
      })
    }
    const mouseup = () => {
      this.trigger('ease.submit', {
        lineWidth: 20,
        points: easePoints
      });
      this.ctx.restore();
      this.off('mousemove', mousemove);
      this.off('mouseup', mouseup);
      this.off('mouseleave', mouseup);
    }
    this.on('mousemove', mousemove);
    this.on('mouseup', mouseup);
    this.on('mouseleave', mouseup);
  }

  [`${ELLIPSE}MousedownListener`](e) {
    console.log(ELLIPSE, 'mousedown');
    const ctx = this.ctx;
    const points = [];
    // store the start position of the rect.
    const x = event.offsetX, y = event.offsetY
    points.push({
      x: x / ctx.canvas.width,
      y: y / ctx.canvas.height
    })
    const ellipseData = {
      points,
      lineWidth: 2
    };
    // create temp canvas for preview rect in real-time.
    ctx.strokeStyle = this.color;

    const onmousemove = (e) => {
      points[1] = {};
      // clear previous ellipse.
      DataCanvas.clear(ctx);
      points[1].x = e.offsetX / this.ctx.canvas.width;
      points[1].y = e.offsetY / this.ctx.canvas.height;
      DataCanvas.ellipse(ctx, ellipseData);
    }

    const offmousemove = () => {
      DataCanvas.clear(ctx);
      if (ellipseData.points[1]) {
        this.trigger('ellipse.submit', ellipseData);
      }
      this.off('mousemove');
      this.off('mouseup', offmousemove);
      this.off('mouseleave', offmousemove);
    }

    this.on('mousemove', onmousemove);
    this.on('mouseup', offmousemove);
    this.on('mouseleave', offmousemove);
  }

  setColor(color) {
    this.color = color;
  }

  width(width) {
    return this.options.width;
  }

  height(heihgt) {
    return this.options.height;
  }

  getComputedDprSize(x) {
    return x * this.options.screenDpr;
  }

  resize() {
    this.el.width = this.width();
    this.el.height = this.height();
    this.el.style.height = `${this.el.height / this.options.screenDpr}px`;
    this.el.style.width = `${this.el.width / this.options.screenDpr}px`;

    if (this.textTool){
      this.textTool.resize();
    }
  }
}

export default DrawCavans;
