const path = require('path');
const webpack  = require('webpack');

module.exports = {
  entry: path.join(__dirname, '../../', 'src/index.js'),
  output: {
    path: path.join(__dirname, '../../', 'dist'),
    filename: 'sketch.js',
    library: 'Sketch',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      }, {
        test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
        loader: 'url-loader',
      }, {
        test: /\.less$/,
        loader: ['style-loader', 'css-loader', 'less-loader']
      }
    ]
  },
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: '[name].js.map'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
      }
    })
  ]
}