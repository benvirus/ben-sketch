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
const sketch = new Sketch({
    container: document.getElementById('sketch')
});
```

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

##### 1.1.3 (2017-08-09)
* [bugfix] 修复鼠标移出绘图区域橡皮擦工具会重复多次的bug。

##### 1.1.2 (2017-08-09)
* [optimize] 添加文字工具和橡皮工具的鼠标样式。
* [bugfix] 提高最外层容器的z-index，使之不会被覆盖。

##### 1.1.1 (2017-08-08)
* [bugfix] 修复鼠标移出绘画区域，绘制动作没有终止的bug。

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
