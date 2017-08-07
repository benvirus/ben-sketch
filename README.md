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

```
// js
const sketch = new Sketch({
    container: document.getElementById('sketch')
});
```

### Change Log

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
