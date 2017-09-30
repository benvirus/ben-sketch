import Component from 'ben-component';
import DataCanvas from 'ben-canvas';
import lineCursor from '../img/pen@1x.ico';
import rectCursor from '../img/rect.ico';
import DrawCanvas from './draw-canvas';

const LINE = 'line';
const RECT = 'rect';
const TEXT = 'text';
const EASE = 'ease';
const ELLIPSE = 'ellipse';
const tools = [LINE, RECT, TEXT, EASE, ELLIPSE];
const EASE_WIDTH = 20;
const TEXT_SIZE = 14;
const TEXT_HEIGHT = 18;

const COLOR_RED = '#f00';
const COLOR_DEFAULT = COLOR_RED;

class Sketch extends Component {
  constructor(options) {
    options.textSize || (options.textSize = TEXT_SIZE);
    options.textLineHeight || (options.textLineHeight = TEXT_HEIGHT);
    options.width || (options.width = options.container.clientWidth);
    options.height || (options.height = options.container.clientHeight);
    options.toolType || (options.toolType = '');
    super(null, options);
    this.ctx = this.canvas.getContext('2d');
    this.initDrawCanvas();
    this.addChild(this.drawCanvas);
    this.container = this.options.container;
    this.container.appendChild(this.el);
    this.color = COLOR_DEFAULT;
    this.cache = [];
    this.textMeasure();
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
    console.log(this.options);
    const canvas = super.createEl('canvas', {
      width: this.options.width,
      height: this.options.height,
      style: 'display: block;'
    }, {
      className: 'ben-sketch_canvas'
    });
    return canvas;
  }

  initDrawCanvas() {
    this.drawCanvas = new DrawCanvas(this, this.options);

    this.on('colorchange', () => {
      this.drawCanvas.color = this.color;
    });

    this.on('toolchange', () => {
      this.drawCanvas.tool = this.toolType;
    });
    
    tools.map(type => {
      this.drawCanvas.on(`${type}.submit`, (event, data) => {
        DataCanvas[type](this.ctx, data);
        this.trigger(type, data);
      });
    });
  }

  textMeasure() {
    const measureEl = this.measureEl = super.createEl('pre', {
      'class': 'sketch-temp text-pre',
      style: `font-size: ${ this.options.textSize }px; line-height: ${ this.options.textLineHeight }px;`
    });
    this.el.appendChild(measureEl);
  }

  width(width) {
    if (typeof width !== 'undefined') {
      this.options.width = width;
      return width;
    }
    return this.options.width;
  }

  height(height) {
    if (typeof height !== 'undefined') {
      this.options.height = height;
      return height;
    }
    return this.options.height;
  }

  setTool(toolName) {
    if (toolName == this.toolType) {
      return;
    }
    this.toolType = toolName;
    this.trigger('toolchange');
  }

  setColor(color) {
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
    this.canvas.width = this.width(this.el.clientWidth);
    this.canvas.height = this.height(this.el.clientHeight);
    console.log(this.options === this.drawCanvas.options);
    this.drawCanvas.resize();
  }
}

module.exports = Sketch;

