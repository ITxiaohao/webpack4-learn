const path = require('path')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 引入插件

module.exports = {
  entry: {
    page: './src/page.js'
  },
  output: {
    publicPath: './', // js 引用的路径或者 CDN 地址
    path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
    filename: '[name].bundle.js', // 代码打包后的文件名
    chunkFilename: '[name].js' // 代码拆分后的文件名
  },
  plugins: [
    new CleanWebpackPlugin(), // 默认情况下，此插件将删除 webpack output.path 目录中的所有文件，以及每次成功重建后所有未使用的 webpack 资产。
    new HtmlWebpackPlugin({
      // 打包输出HTML
      title: '自动生成 HTML',
      minify: {
        // 压缩 HTML 文件
        removeComments: true, // 移除 HTML 中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true // 压缩内联 css
      },
      filename: 'index.html', // 生成后的文件名
      template: 'index.html', // 根据此模版生成 HTML 文件
      chunks: ['page'] // entry中的 page 入口才会被打包
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        lodash: {
          name: 'chunk-lodash', // 单独将 lodash 拆包
          priority: 10, // 优先级要大于 commons 不然会被打包进 commons
          test: /[\\/]node_modules[\\/]lodash[\\/]/
        },
        commons: {
          name: 'chunk-commons',
          minSize: 1, //表示在压缩前的最小模块大小,默认值是 30kb
          minChunks: 2, // 最小公用次数
          priority: 5, // 优先级
          reuseExistingChunk: true // 公共模块必开启
        }
      }
    }
  }
}
