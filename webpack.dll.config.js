const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    bundle: [
      // 可以讲永久不变的第三方库 整和打包 独立出来
      'react',
      'react-dom',
      'redux',
      'react-redux',
      'redux-saga',
      'react-router-cache-route',
      'react-router-dom'
    ]
  },
  output: {
    filename: '[name].dll.js',
    path: path.join(__dirname, './public/dll'),
    libraryTarget: 'var',
    library: '_dll_[name]_[hash]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, './public/dll', '[name].manifest.json'),
      name: '_dll_[name]_[hash]'
    })
  ]
};
