/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    app: './src/index.js' // 需要打包的文件入口
  },
  module: {
    rules: [
      {
        test: /\.js$/, // 使用正则来匹配 js 文件
        exclude: /nodes_modules/, // 排除依赖包文件夹
        use: {
          loader: 'eslint-loader' // 使用 eslint-loader
        }
      }
    ]
  },
  output: {
    // eslint-disable-next-line no-undef
    publicPath: __dirname + '/dist/', // js 引用的路径或者 CDN 地址
    // eslint-disable-next-line no-undef
    path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
    filename: 'bundle.js' // 打包后生产的 js 文件
  }
}
