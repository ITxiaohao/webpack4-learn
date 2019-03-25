const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'production',
  entry: {
    lodash: ['lodash'],
    jquery: ['jquery']
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, '../dll'),
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]',
      path: path.resolve(__dirname, '../dll/[name].manifest.json') // 用这个插件来分析打包后的这个库，把库里的第三方映射关系放在了这个 json 的文件下，这个文件在 dll 目录下
    })
  ]
}
