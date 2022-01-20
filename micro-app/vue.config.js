const packageName = require('./package.json').name

module.exports = {
  lintOnSave: false,
  devServer: {
    port: 7071,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  configureWebpack: {
    devtool: 'source-map',
    output: {
      library: `${packageName}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${packageName}`
    }
  },
} 