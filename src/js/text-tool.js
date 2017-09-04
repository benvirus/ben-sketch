import Component from 'ben-component';
import Canvas from 'ben-canvas';

class TextTool extends Component {
  constructor(container, options) {
    super(undefined, options);
    this.container = container;
    container.appendChild(this.el);
    this.inputEl.focus();
  }

  createEl() {
    const el = super.createEl('div', {
      'class': 'text-component',
      style: `left: ${this.options.x}px; top: ${this.options.y}px;`
    });

    const inputEl = this.inputEl = super.createEl('textarea', {
      'class': 'tc-input',
      style: `width: 100%; height: 100%; color: ${this.options.color}`,
      placeholder: '请点击输入'
    });
    inputEl.setAttribute('autofocus', true);
    inputEl.onblur = () => {
      inputEl.removeAttribute('autofocus');
      this.trigger('submit', {
        data: this.text()
      });
      this.dispose();
    };
    inputEl.addEventListener('input', (e) => {
      this.trigger('valuechange', inputEl.value);
    });
    el.appendChild(inputEl);
    return el;
  }

  clear() {
    this.inputEl.innerHTML = '';
  }

  text() {
    return this.inputEl.value;
  }

  dispose() {
    this.container.removeChild(this.el);
  }

  width(value) {
    if (value) {
      this.el.style.width = value + 'px';
    }
  }

  height(value) {
    if (value) {
      this.el.style.height = value + 'px';
    }
  }

}

export default TextTool;
