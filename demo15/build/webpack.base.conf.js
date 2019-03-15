const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将 css 单独打包成文件

const path = require('path')

const productionConfig = require('./webpack.prod.conf.js') // 引入生产环境配置文件
const developmentConfig = require('./webpack.dev.conf.js') // 引入开发环境配置文件

/**
 * 根据不同的环境，生成不同的配置
 * @param {String} env "development" or "production"
 */
const generateConfig = env => {
  // 将需要的 Loader 和 Plugin 单独声明

  let scriptLoader = [
    {
      loader: 'babel-loader'
    }
  ]

  let cssLoader = [
    'style-loader',
    'css-loader',
    'sass-loader', // 使用 sass-loader 将 scss 转为 css
    'postcss-loader' // 使用 postcss 为 css 加上浏览器前缀
  ]

  let cssExtractLoader = [
    {
      loader: MiniCssExtractPlugin.loader
    },
    'css-loader',
    'sass-loader', // 使用 sass-loader 将 scss 转为 css
    'postcss-loader' // 使用 postcss 为 css 加上浏览器前缀
  ]

  let fontLoader = [
    {
      loader: 'url-loader',
      options: {
        name: '[name]-[hash:5].min.[ext]',
        limit: 5000, // fonts file size <= 5KB, use 'base64'; else, output svg file
        publicPath: 'fonts/',
        outputPath: 'fonts/'
      }
    }
  ]

  let imageLoader = [
    {
      loader: 'url-loader',
      options: {
        name: '[name]-[hash:5].min.[ext]',
        limit: 10000, // size <= 10KB
        outputPath: 'images/'
      }
    },
    // 图片压缩
    {
      loader: 'image-webpack-loader',
      options: {
        // 压缩 jpg/jpeg 图片
        mozjpeg: {
          progressive: true,
          quality: 50 // 压缩率
        },
        // 压缩 png 图片
        pngquant: {
          quality: '65-90',
          speed: 4
        }
      }
    }
  ]

  let styleLoader =
    env === 'production'
      ? cssExtractLoader // 生产环境下压缩 css 代码
      : cssLoader // 开发环境：页内样式嵌入

  return {
    entry: { app: './src/app.js' },
    output: {
      publicPath: env === 'development' ? '/' : './',
      path: path.resolve(__dirname, '..', 'dist'),
      filename: '[name]-[hash:5].bundle.js',
      chunkFilename: '[name]-[hash:5].chunk.js'
    },
    module: {
      rules: [
        { test: /\.js$/, exclude: /(node_modules)/, use: scriptLoader },
        { test: /\.(sa|sc|c)ss$/, use: styleLoader },
        { test: /\.(eot|woff2?|ttf|svg)$/, use: fontLoader },
        { test: /\.(png|jpg|jpeg|gif)$/, use: imageLoader }
      ]
    },
    plugins: [
      // 开发环境和生产环境二者均需要的插件
      new HtmlWebpackPlugin({
        title: 'webpack4 实战',
        filename: 'index.html',
        template: path.resolve(__dirname, '..', 'index.html'),
        // chunks: ['app'],
        minify: {
          collapseWhitespace: true
        }
      }),
      new webpack.ProvidePlugin({ $: 'jquery' })
    ]
  }
}

module.exports = env => {
  let config = env === 'production' ? productionConfig : developmentConfig
  return merge(generateConfig(env), config) // 合并 公共配置 和 环境配置
}
