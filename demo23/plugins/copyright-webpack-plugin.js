class CopyrightWebpackPlugin {
  // constructor(options) {
  //   console.log('插件被使用了')
  //   console.log('options = ', options)
  // }
  apply(compiler) {

    // 同步钩子
    compiler.hooks.compile.tap('CopyrightWebpackPlugin', (compilation)=>{
      console.log('compile');
    })

    // 异步钩子
    compiler.hooks.emit.tapAsync('CopyrightWebpackPlugin', (compilation, cb)=> {
      compilation.assets['copyright.txt']= {
        source: function() {
          return 'copyright by xh';
        },
        size: function() {
          return 15; // 字符长度
        }
      }
      console.log('compilation.assets = ',compilation.assets);
      cb()
    })
  }
}

module.exports = CopyrightWebpackPlugin
