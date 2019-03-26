const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js'
  },
  resolveLoader: {
    modules: ['node_modules', './loaders']
  },
  module: {
    rules: [
      {
        test: /.js/,
        use: [
          {
            loader: 'replaceLoader.js'
          },
          {
            loader: 'replaceLoaderAsync.js',
            options: {
              name: 'xh'
            }
          }
        ]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  }
}
