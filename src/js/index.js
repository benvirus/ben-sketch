import Component from 'ben-component';
import DataCanvas from 'ben-canvas';
import lineCursor from '../img/pen@1x.ico';
import rectCursor from '../img/rect.ico';
import DrawCanvas from './draw-canvas';

const LINE = 'line';
const RECT = 'rect';
const TEXT = 'text';
const EASE = 'ease';
const tools = [LINE, RECT, TEXT, EASE];
const EASE_WIDTH = 20;

const COLOR_RED = '#f00';
const COLOR_DEFAULT = COLOR_RED;

class Sketch extends Component {
  constructor(options) {
    options.toolType || (options.toolType = LINE);
    super(null, options);
    this._width = options.width || options.container.clientWidth;
    this._height = options.height || options.container.clientHeight;
    this.ctx = this.canvas.getContext('2d');
    this.drawCanvas = new DrawCanvas(this, {
      width: options.container.clientWidth,
      height: options.container.clientHeight
    });
    this.initDrawCanvas();
    this.addChild(this.drawCanvas);
    this.container = this.options.container;
    this.container.appendChild(this.el);
    this.toolType = LINE;
    this.color = COLOR_DEFAULT;
    this.cache = [];
    this.textMeasure();
    // this.initEvent();
    this.text = false;

    this.on('toolchange', () => {
      tools.map(toolClass => {
        this.hasClass(toolClass) ? this.removeClass(toolClass) : null;
      });
      this.addClass(this.toolType);
    });

    this.on('contextmenu', (e) => {
      e.stopPropagation();
      e.preventDefault();
    })
  }

  createEl() {
    const el = super.createEl('div', {
      style: `display: block; width: 100%; height: 100%;`
    }, {
      className: `ben-sketch ${this.options.toolType}`
    });
    this.canvas = this.createCanvas();
    el.appendChild(this.canvas);
    return el;
  }

  createCanvas() {
    const canvas = super.createEl('canvas', {
      width: this.options.container.clientWidth,
      height: this.options.container.clientHeight,
      style: 'display: block;'
    }, {
      className: 'ben-sketch_canvas'
    });
    return canvas;
  }

  initDrawCanvas() {
    this.drawCanvas = new DrawCanvas(this, {
      width: this.options.container.clientWidth,
      height: this.options.container.clientHeight
    });

    this.on('colorchange', () => {
      this.drawCanvas.color = this.color;
    });

    this.on('toolchange', () => {
      this.drawCanvas.tool = this.toolType;
    });
    
    ['line', 'rect', 'text', 'ease'].map(type => {
      this.drawCanvas.on(`${type}.submit`, (event, data) => {
        DataCanvas[type](this.ctx, data);
        this.trigger(type, data);
      });
    });
  }

  textMeasure() {
    const measureEl = this.measureEl = super.createEl('pre', {
      'class': 'sketch-temp text-pre',
    });
    this.el.appendChild(measureEl);
  }

  width() {
    return this._width;
  }

  height() {
    return this._height;
  }

  setTool(toolName) {
    if (!toolName) {
      throw new Error('Sketch:setTool(toolName): toolName argument is needed!');
    }
    if (toolName == this.toolType) {
      return;
    }
    this.toolType = toolName;
    this.trigger('toolchange');
  }

  setColor(color) {
    console.log(color);
    if (!color) {
      throw new Error('Sketch:setTool(toolColor): toolColor argument is needed!');
    }
    this.color = color;
    this.trigger('colorchange');
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
    this.cache = [];
  }

  resize() {
    this.canvas.width = this.options.container.clientWidth;
    this.canvas.height = this.options.container.clientHeight;
  }
}

module.exports = Sketch;

