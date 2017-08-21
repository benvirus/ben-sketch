import Component from 'ben-component';
import DataCanvas from 'ben-canvas';
import TextTool from './text-tool';

const LINE = 'line';
const RECT = 'rect';
const TEXT = 'text';
const EASE = 'ease';
const tools = [LINE, RECT, TEXT, EASE];

const COLOR_RED = '#f00';
const COLOR_DEFAULT = COLOR_RED;

class DrawCavans extends Component {
  constructor(parent, options) {
    super(parent, options);
    this.tool = LINE;
    this.color = COLOR_DEFAULT;
    this.initEvent();
  }

  createEl() {
    const el = super.createEl('canvas', {
      width: this.options.width,
      height: this.options.height,
      style: 'display: block;'
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
      this[`${this.tool}MousedownListener`](e);
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
      x: e.offsetX / this.el.width,
      y: e.offsetY / this.el.height
    });
    const ommousemove = (event) => {
      DataCanvas.clear(this.ctx);
      linePoints.push({
        x: event.offsetX / this.el.width,
        y: event.offsetY / this.el.height
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
        x: x / this.ctx.canvas.width,
        y: y / this.ctx.canvas.height
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
      rectData.width = width / this.ctx.canvas.width;
      rectData.height = height / this.ctx.canvas.height;
      // draw the current rect to temp canvas for preview.
      this.ctx.strokeRect(x, y, width, height);
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
    const textTool = this.textTool = new TextTool(this.parent.el, x, y);
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
          x: x / this.ctx.canvas.width,
          y: y / this.ctx.canvas.height
        },
        color: this.color,
        text: data.data
      }
      this.trigger('text.submit', textOptions);
    });
  }

  [`${EASE}MousedownListener`](e) {
    console.log(EASE, 'mousedown');
    const easePoints = [];
    easePoints.push({
      x: e.offsetX / this.ctx.canvas.width,
      y: e.offsetY / this.ctx.canvas.height
    });
    const mousemove = (e) => {
      easePoints.push({
        x: e.offsetX / this.ctx.canvas.width,
        y: e.offsetY / this.ctx.canvas.height
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

  setColor(color) {
    this.color = color;
  }

  width() {
    return this.options.width;
  }

  height() {
    return this.options.height;
  }
}

export default DrawCavans;