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

const compile = webpack(webpackConf);
cleanDist();

compile.run(function() {
  console.log('> Finished Build!')
});