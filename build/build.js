const webpack = require('webpack');
const webpackConf = require('./webpack-config/base.js');

const compile = webpack(webpackConf);
compile.run(function() {
  console.log('Finished Build!')
});