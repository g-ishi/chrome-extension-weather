const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

// commonから設定を継承し、上書きしたい設定値のみ指定する
module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
});
