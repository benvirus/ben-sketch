const webpack = require('webpack');
const webpackConf = require('./webpack-config/base');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const express = require('express');

const compiler = webpack(webpackConf);
const devMiddleware = webpackDevMiddleware(compiler);
const hotMiddleware = webpackHotMiddleware(compiler, {
  log: () => {}
});

const app = express();
app.use(devMiddleware);
app.use(hotMiddleware);
app.use(express.static('./'));

app.listen(9100);