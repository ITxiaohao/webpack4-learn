const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')

// 分析依赖模块
const moduleAnalyser = filename => {
  const content = fs.readFileSync(filename, 'utf-8')
  const ast = parser.parse(content, {
    sourceType: 'module'
  })
  const dependencise = {}
  traverse(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(filename)
      const newFile = '.\\' + path.join(dirname, node.source.value)
      dependencise[node.source.value] = newFile
    }
  })
  const { code } = babel.transformFromAst(ast, null, {
    presets: ['@babel/preset-env']
  })
  return {
    filename,
    dependencise,
    code
  }
}

// 依赖图谱
const makeDependenciesGraph = entry => {
  const entryModule = moduleAnalyser(entry)
  const graphArray = [entryModule]
  for (let i = 0; i < graphArray.length; i++) {
    const item = graphArray[i]
    const { dependencise } = item
    // 如果入口文件有依赖就去做循环依赖，对每一个依赖做分析
    if (dependencise) {
      for (const j in dependencise) {
        if (dependencise.hasOwnProperty(j)) {
          graphArray.push(moduleAnalyser(dependencise[j]))
        }
      }
    }
  }
  // 创建一个对象，将分析后的结果放入
  const graph = {}
  graphArray.forEach(item => {
    graph[item.filename] = {
      dependencise: item.dependencise,
      code: item.code
    }
  })
  return graph
}

const generateCode = entry => {
  // makeDependenciesGraph 返回的是一个对象，需要转换成字符串
  const graph = JSON.stringify(makeDependenciesGraph(entry))
  return `
    (function (graph) {
      function require(module) {
        function localRequire(relativePath) {
          return require(graph[module].dependencise[relativePath])
        }
        var exports = {};
        (function (require, exports, code) {
          eval(code)
        })(localRequire, exports, graph[module].code)
        return exports;
      };
      require('${entry}')
    })(${graph});
  `
}

const code = generateCode('./src/index.js')
console.log(code)
