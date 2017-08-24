const fs = require('fs');
const execSync = require('child_process').execSync;
const webpack = require('webpack');
const webpackConf = require('./webpack-config/base.js');

const cleanDist = () => {
  console.log('> Clean dist...');
  try {
    fs.statSync(webpackConf.output.path);
  } catch(err) {
    return;
  }
  const res = execSync(`rm -r ${webpackConf.output.path}`);
  if (res.toString()) {
    throw new Error(res);
  }
}

webpackConf.devtool = '#cheap-module-source-map';

const compile = webpack(webpackConf);
cleanDist();

compile.run(function(err, stats) {
  if (err) {
    throw err;
  }
  const info = stats.toString({
    colors: true
  });
  console.log(info);
});