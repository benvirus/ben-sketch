import Component from 'ben-component';
import DataCanvas from 'ben-canvas';
import lineCursor from '../img/pen@1x.ico';
import rectCursor from '../img/rect.ico';
import DrawCanvas from './draw-canvas';
import { removeFromList } from './compute';

const LINE = 'line';
const RECT = 'rect';
const TEXT = 'text';
const EASE = 'ease';
const ELLIPSE = 'ellipse';
const ARROW = 'arrow';
const SLINE = 'sline';
const tools = [LINE, RECT, TEXT, EASE, ELLIPSE, ARROW, SLINE];
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
    this.defaultPage = 0;
    this.pageNum = this.defaultPage;
    this.cache = {
      0: [],
    };
    this.undoList = {
      0: {},
    }
    this.clearTimeList = {
      0: 0,
    };
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
        this.cache[this.pageNum].push({
          type,
          options: data,
        });
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

  judgeSkipDraw(options) {
    if (!options.page || options.time) {
      return;
    }
    const skipRule = this.undoList[options.page][options.time];
    if (skipRule) {
      delete this.undoList[options.page][options.time];
      return true;
    }
  }

  judgeClearDraw(options) {
    if (!options.page || options.time) {
      return;
    }
    const currentClearTime = this.clearTimeList[options.page] || 0;
    if (options.time && options.time < currentClearTime) {
      return true;
    }
  }

  draw(type, options) {
    let pageNum = this.pageNum;
    if (!isNaN(options.page)) {
      pageNum = options.page;
    }
    if (this.judgeSkipDraw(options) || this.judgeClearDraw(options)) {
      return;
    }
    if (!this[type]) {
      if (pageNum === this.pageNum) {
        DataCanvas[type](this.ctx, options);
      }
      if (!this.cache[pageNum]) {
        this.cache[pageNum] = [];
      }
      this.cache[pageNum].push({
        type,
        options
      });
    } else {
      this[type](options);
    }
    console.log('cache', this.cache);
  }

  empty() {
    DataCanvas.clear(this.ctx);
    this.pageNum = 0;
    this.cache = {
      0: [],
    };
  }

  clear(options = { page: this.pageNum }) {
    const page = options.page;
    if (isNaN(page) || page === this.pageNum) {
      DataCanvas.clear(this.ctx);
    }
    const pageNum = isNaN(page) ? this.pageNum : page;
    if (options.time) {
      removeFromList(this.cache[pageNum], {
        page,
        judge: {
          key: time,
          rule: (a, b) => a >= b,
        },
        value: options.time,
      })
    }
    this.cache[pageNum] = [];
  }

  changePage(options = { page: this.pageNum }) {
    const pageNum = options.page;
    if (isNaN(pageNum) || pageNum === this.pageNum) {
      return;
    }
    this.pageNum = pageNum;
    if (!this.cache[pageNum]) {
      this.cache[pageNum] = [];
    }
    this.repaint(pageNum);
  }

  repaint(pageNum) {
    DataCanvas.clear(this.ctx);
    pageNum = isNaN(pageNum) ? this.pageNum : pageNum;
    this.cache[pageNum].map((item) => {
      if (item.type) {
        DataCanvas[item.type](this.ctx, item.options);
      }
    });
  }

  undo(options = { page: this.pageNum, judge: { key: 'time', rule: (a, b) => a === b, }, id }) {
    const page = options.page;
    const pageNum = isNaN(page) ? this.pageNum : page;
    if (!this.cache[pageNum]) {
      this.cache[pageNum] = [];
    }
    if (options.judge.key && options.id) {
      this.removeFromCacheList({
        page,
        judge: options.judge,
        id: options.id,
      });
    } else {
      this.cache[pageNum].pop();
    }
    if (pageNum === this.pageNum) {
      this.repaint(pageNum);
    }
  }

  removeFromCacheList({ page, judge, id }) {
    const currentCache = this.cache[page];
    // 移除需要跳过/清除的操作
    const removeResult = removeFromList(currentCache, { judge, value: id });
    if (removeResult) {
      this.undoList[page][id] = judge;
    }
  }

  resize() {
    this.canvas.width = this.width(this.el.clientWidth);
    this.canvas.height = this.height(this.el.clientHeight);
    console.log(this.options === this.drawCanvas.options);
    this.drawCanvas.resize();
    this.repaint(this.pageNum);
  }
}

module.exports = Sketch;

