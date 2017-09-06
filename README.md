# ben-sketch

### screen shot

##### line

![line](./screenshot/line.gif)

##### rect

![rect](./screenshot/rect.gif)

##### text

![text](./screenshot/text.gif)

##### ease

![ease](./screenshot/ease.gif)

### Usage

import js and set a div element for init the sketch instance.

```html
// html
<script type="text/javascript" src="//{you path to the dist file}/dist/sketch.js"></script>
<div id="sketch"></div>
```

```js
// js
const options = {
    container: document.getElementById('sketch')
}
const sketch = new Sketch(options);
```

### Options

| Options | Type | Example | description |
| ------ | --------- | ----------- |
| container | DOM (require) | document.getElementById('sketch') | 用来实例化的DOM节点 |
| textSize | Int | 14（default） | 设置文字工具的文字大小 |
| textLineHeight | Int | 18 (default) | 设置文字工具的文字行高 |

### Api Method

| method | arguments | description |
| ------ | --------- | ----------- |
| setTool(Enum toolName) | Enum('line', 'rect', 'text', 'ease') | Set the current tool of sketch instance |
| setColor(String color) | String 'rgb(0,255,255)' or '#ff0' or 'rgba(255,255,255,0.5)' | Set the current color of sketch instance |
| clear | (empty) | Clear all draws of the sketch instance |

##### example

```js
const sketch = new Sketch({
    container: containerEl
});

sketch.setTool('rect'); // Set the tool to rectangle.
sketch.setColor('rgba(255,0,0,0.5)');  // Set the color to red with 50% opacity.
sketch.clear(); // Clear the sketch
```

### Event

| eventName | callback arguments | Descriptions |
| --------- | ------------------ | ------------ |
| line | data | Emit when a line was drawed |
| rect | data | Emit when a rect was drawed |
| text | data | Emit when a text was drawed |
| ease | data | Emit when a ease action happend |

##### example

```js
const sketch = new Sketch({
    container: containerEl
});

sketch.on('line', (data) => {
    // ...   You can done anything with the line data. 
    // The data include all the points of the line.
});

sketch.on('rect', (data) => {
    // ...   You can done anything with the rect data. 
    // The data include the rect's position, width, height, etc.
});

// ...
```

### Change Log

##### 1.2.5 (2017-09-06)
* [feature] 实现文字输入的大小行高可配置。

##### 1.2.4 (2017-09-04)
* [optimize] 文字在输入的过程中，颜色也会根据当前颜色显示。

##### 1.2.2 (2017-08-24)
* [optimize] 提供一种没有选中工具的状态，对鼠标动作不做任何的处理。并且完成实例化后的默认状态为空。

##### 1.2.0 (2017-08-24)
* [bugfix] 在设置为不支持的工具类型时导致的事件监听器报错的问题。
* [bugfix] 修复在通过调用 resize 来响应窗口变化时，绘图层不会同步变化而带来的绘图出现偏移的问题。
* [bugfix] 修复鼠标移出绘图区域橡皮擦工具会重复多次的bug。
* [bugfix] 提高最外层容器的z-index，使之不会被覆盖。
* [bugfix] 修复鼠标移出绘画区域，绘制动作没有终止的bug。
* [optimize] 修改绘图策略，采用常驻的绘图层，不再临时生成绘图层，完成后再删掉，会有一定的性能上的提升。
* [optimize] 屏蔽鼠标右键，只支持鼠标左键点击绘图。
* [optimize] 添加文字工具和橡皮工具的鼠标样式。
* [optimize] 添加自动发布脚本。
* [feature] 新增 width 和 height 两个可选参数来定义绘图区域的大小，不传会使用container.clientWidht 和 container.clientHeight 作为绘图区域的大小。

##### 1.1.0 (2017-08-07)
* [feature] 提供颜色设置功能。
* [feature] Add example and screenshot to README.md
* [feature] 提供编译后的文件，无需使用者配置编译环境。
* [feature] 提供开发和打包的 webpack 配置。
* [bugfix] 修复因为内部 canvas 的样式定位问题导致的不能绘图的bug。
* [bugfix] 修复在firfox 浏览器下绘制文字位置错乱的问题。
* [bugfix] 更新 ben-canvas 的版本依赖，修复重复划线或者重复擦除的bug。
* [bugfix] 修复 package 中遗漏样式文件的bug。

##### 1.0.0 (2017-08-03) 👏
* [feature] 完成基本的画图功能组件。

### Contact

Author: Ben Chen

E-mail: chenhaijiao@howzhi.com

Contributor: 高勇

E-mail: gaoyong@howzhi.com
