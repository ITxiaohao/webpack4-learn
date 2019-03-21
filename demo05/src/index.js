// index.js
import './a.js'
import './b.js'

// 异步代码
function getComponent() {
  // 使用 jsonp 的形式导入 lodash，default: _ 表示用 _ 代指 lodash
  return import('lodash').then(({ default: _ }) => {
    var element = document.createElement('div')
    element.innerHTML = _.join(['hello', 'world'], '-')
    return element
  })
}

getComponent().then(element => {
  document.body.appendChild(element)
})
