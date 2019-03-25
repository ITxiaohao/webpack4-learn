const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const makePlugins = configs => {
  // 基础插件
  const plugins = [
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({ $: 'jquery' })
  ]

  // 根据 entry 自动生成 HtmlWebpackPlugin 配置，配置多页面
  Object.keys(configs.entry).forEach(item => {
    plugins.push(
      new HtmlWebpackPlugin({
        title: '多页面配置',
        template: path.resolve(__dirname, '..', 'index.html'),
        filename: `${item}.html`,
        chunks: [item, 'vendors', 'code-segment', 'jquery', 'lodash']
      })
    )
  })

  // 自动引入 dll 中的文件
  const files = fs.readdirSync(path.resolve(__dirname, '../dll'))
  files.forEach(file => {
    if (/.*\.dll.js/.test(file)) {
      plugins.push(
        new AddAssetHtmlWebpackPlugin({
          filepath: path.resolve(__dirname, '../dll', file)
        })
      )
    }
    if (/.*\.manifest.json/.test(file)) {
      plugins.push(
        new webpack.DllReferencePlugin({
          manifest: path.resolve(__dirname, '../dll', file)
        })
      )
    }
  })

  return plugins
}

const configs = {
  entry: {
    index: './src/app.js',
    list: './src/list.js'
  },
  output: {
    path: path.resolve(__dirname, '..', 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].min.[ext]',
              limit: 1000, // size <= 1KB
              outputPath: 'images/'
            }
          },
          // img-loader for zip img
          {
            loader: 'image-webpack-loader',
            options: {
              // 压缩 jpg/jpeg 图片
              mozjpeg: {
                progressive: true,
                quality: 65 // 压缩率
              },
              // 压缩 png 图片
              pngquant: {
                quality: '65-90',
                speed: 4
              }
            }
          }
        ]
      },
      {
        test: /\.(eot|ttf|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name]-[hash:5].min.[ext]',
            limit: 5000, // fonts file size <= 5KB, use 'base64'; else, output svg file
            publicPath: 'fonts/',
            outputPath: 'fonts/'
          }
        }
      }
    ]
  },
  performance: false
}

makePlugins(configs)

configs.plugins = makePlugins(configs)

module.exports = configs
