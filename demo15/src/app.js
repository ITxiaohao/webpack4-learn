import '@babel/polyfill'

import './assets/style/base.scss'
import './assets/style/common.scss'

import './assets/font/iconfont.css' // 引入字体文件

import sum from './vendor/sum'
console.log('sum(1, 2) = ', sum(1, 2))

var minus = require('./vendor/minus')
console.log('minus(1, 2) = ', minus(1, 2))

require(['./vendor/multi'], function(multi) {
  console.log('multi(1, 2) = ', multi(1, 2))
})

// 发送跨域请求
$.get(
  '/comments/hotflow',
  {
    id: '4263554020904293',
    mid: '4263554020904293',
    max_id_type: '0'
  },
  function(data) {
    console.log(data)
  }
)
