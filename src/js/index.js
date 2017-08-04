import Component from 'ben-component';
import TextTool from './text-tool';
import DataCanvas from 'ben-canvas';
import lineCursor from '../img/pen@1x.ico';
import rectCursor from '../img/rect.ico';

const LINE = 'line';
const RECT = 'rect';
const TEXT = 'text';
const EASE = 'ease';

class Sketch extends Component {
  constructor(options) {
    super(null, options);
    this.ctx = this.canvas.getContext('2d');
    this.container = this.options.container;
    this.container.appendChild(this.el);
    this.toolType = LINE;
    this.color = '#f00';
    this.cache = [];
    this.textMeasure();
    this.initEvent();
    this.text = false;
  }

  createEl() {
    const el = super.createEl('div', {
      style: `display: block; width: 100%; height: 100%;`
    }, {
      className: 'ben-sketch'
    });
    this.canvas = this.createCanvas();
    el.appendChild(this.canvas);
    return el;
  }

  createCanvas() {
    console.log(this.options.container.clientWidth, this.options.container.clientHeight)
    const canvas = super.createEl('canvas', {
      width: this.options.container.clientWidth,
      height: this.options.container.clientHeight,
      style: 'display: block;'
    }, {
      className: 'pf-canvas'
    });
    return canvas;
  }

  initEvent() {
    this.on('mousedown', (e) => {console.log(this.toolType); this[`${this.toolType}MousedownListener`](e)});
    this.on('mouseup', (e) => this[`${this.toolType}MouseupListener`](e));
  }

  textMeasure() {
    const measureEl = this.measureEl = super.createEl('pre', {
      'class': 'sketch-temp text-pre',
    });
    this.container.appendChild(measureEl);
  }

  [`${LINE}MousedownListener`](e) {
    console.log(LINE, 'mousedown');
    const linePoints = [];
    linePoints.push({
      x: e.offsetX,
      y: e.offsetY
    });
    this.tempCanvas = super.createEl('canvas', {
      width: this.canvas.width,
      height: this.canvas.height,
      style: `cursor: url("${lineCursor}") 5 25, auto;`
    }, {
      className: 'sketch-temp line-canvas'
    });
    const lineCtx = this.tempCanvas.getContext('2d');
    lineCtx.lineWidth = 1;
    lineCtx.strokeStyle = this.color;
    lineCtx.lineJoin = 'round';
    lineCtx.lineCap = 'round';
    this.tempCanvas.addEventListener('mousemove', (e) => {
      lineCtx.clearRect(0, 0, this.width(), this.height());
      linePoints.push({
        x: e.offsetX,
        y: e.offsetY
      });
      lineCtx.beginPath();
      lineCtx.moveTo(linePoints[0].x, linePoints[0].y);
      linePoints.map(point => lineCtx.lineTo(point.x, point.y));
      lineCtx.stroke();
    });
    this.tempCanvas.addEventListener('mouseup', (e) => {
      e.stopPropagation();
      this[`${LINE}MouseupListener`](e, linePoints);
    });
    this.container.appendChild(this.tempCanvas);
  }

  [`${LINE}MouseupListener`](e, linePoints) {
    console.log(linePoints);
    console.log(LINE, 'mouseup');
    if (this.tempCanvas) {
      this.container.removeChild(this.tempCanvas);
      if (linePoints.length < 2) {
        return;
      }
      linePoints.map(point => {
        point.x /= this.tempCanvas.width,
        point.y /= this.tempCanvas.height;
      });
      DataCanvas.line(this.ctx, {
        points: linePoints
      });
      this.trigger(LINE, {
        points: linePoints
      });
    }
  }

  [`${RECT}MousedownListener`](event) {
    console.log(RECT, 'mousedown');
    // store the start position of the rect.
    const x = event.offsetX, y = event.offsetY;
    const rectData = {
      position: {
        x: x / this.ctx.canvas.width,
        y: y / this.ctx.canvas.height
      }
    }
    // create temp canvas for preview rect in real-time.
    this.tempCanvas = super.createEl('canvas', {
      width: this.width(),
      height: this.height(),
      style: `cursor: url("${rectCursor}") 9 17, auto;`
    }, {
      className: 'sketch-temp rect-canvas'
    });
    const rectCtx = this.tempCanvas.getContext('2d');

    this.tempCanvas.addEventListener('mousemove', (e) => {
      // clear previous rect.
      rectCtx.clearRect(0, 0, this.width(), this.height());
      // get the current rect width and height;
      const width = e.offsetX - x,
        height = e.offsetY - y;
      // store the width and height of current rect in ratio of canvas demension.
      rectData.width = width / rectCtx.canvas.width;
      rectData.height = height / rectCtx.canvas.height;
      // draw the current rect to temp canvas for preview.
      rectCtx.strokeRect(x, y, width, height);
    });

    this.tempCanvas.addEventListener('mouseup', (e) => this[`${RECT}MouseupListener`](e, rectData))
    this.container.appendChild(this.tempCanvas);
  }

  [`${RECT}MouseupListener`](e, rectData) {
    console.log(RECT, 'mouseup');
    if (this.tempCanvas) {
      this.container.removeChild(this.tempCanvas);
      if (!rectData.width || !rectData.height) {
        return;
      }
      // Draw the final rect to the target canvas.
      DataCanvas.rect(this.ctx, rectData);
      // send event to sdk.
      this.trigger(RECT, rectData);
    }
  }

  [`${TEXT}MousedownListener`](e) {
    console.log(TEXT, 'mousedown');
  }

  [`${TEXT}MouseupListener`](e) {
    console.log(TEXT, 'mouseup');
    if (this.textTool) {
      this.textTool = null;
      return;
    }
    const textPoints = [];
    textPoints.push({
      x: e.offsetX,
      y: e.offsetY
    });
    const textTool = this.textTool = new TextTool(this.container, textPoints[0].x, textPoints[0].y);
    textTool.on('valuechange', (event, data) => {
      this.measureEl.innerHTML = data + '  ';
      textTool.width(this.measureEl.clientWidth);
      textTool.height(this.measureEl.clientHeight);
    });
    textTool.on('submit', (event, data) => {
      if (!data.data) {
        return;
      }
      const textOptions = {
        position: {
          x: e.offsetX / this.ctx.canvas.width,
          y: e.offsetY / this.ctx.canvas.height
        },
        color: this.color,
        text: data.data
      }
      DataCanvas.text(this.ctx, textOptions);
      this.trigger(TEXT, textOptions);
    });
  }

  [`${EASE}MousedownListener`](e) {
    console.log(EASE, 'mousedown');
    const easePoints = [];
    easePoints.push({
      x: e.offsetX / this.ctx.canvas.width,
      y: e.offsetY / this.ctx.canvas.height
    });
    this.ctx.save();
    this.ctx.lineWidth = 10;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.beginPath();
    const mousemove = (e) => {
      easePoints.push({
        x: e.offsetX / this.ctx.canvas.width,
        y: e.offsetY / this.ctx.canvas.height
      })
      this.ctx.lineTo(e.offsetX, e.offsetY);
      this.ctx.stroke();
    }
    const mouseup = () => {
      this.canvas.removeEventListener('mousemove', mousemove);
      this.canvas.removeEventListener('mouseup', mouseup);
      this.ctx.restore();
      this.trigger(EASE, {
        points: easePoints
      });
    }
    this.canvas.addEventListener('mousemove', mousemove);
    this.canvas.addEventListener('mouseup', mouseup);
  }

  [`${EASE}MouseupListener`](e) {
    console.log(EASE, 'mouseup');
  }

  width() {
    return this.el.clientWidth;
  }

  height() {
    return this.el.clientHeight;
  }

  setTool(toolName) {
    if (!toolName) {
      throw new Error('Sketch:setTool(toolName): toolName argument is needed!');
    }
    this.toolType = toolName;
  }

  draw(type, options) {
    DataCanvas[type](this.ctx, options);
    this.cache.push({
      type,
      options
    });
  }

  clear() {
    DataCanvas.clear(this.ctx);
    this.cache.push({
      type: 'clear'
    });
  }

  resize() {
    this.canvas.width = this.options.container.clientWidth;
    this.canvas.height = this.options.container.clientHeight;
  }
}

module.exports = Sketch;

