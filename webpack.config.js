var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'inline-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './client/index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  resolve: {
    extensions: ['', ".js", ".jsx"]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [{
      test:  /\.js|\.jsx$/,
      loader: 'babel',
      exclude: /node_modules/,
      include: __dirname,
      query: {
        optional: ['runtime'],
        stage: 0,
        env: {
          development: {
            plugins: [
              'react-transform'
            ],
            extra: {
              'react-transform': [{
                target:  'react-transform-hmr',
                imports: ['react'],
                locals:  ['module']
              }]
            }
          }
        }
      }
    }]
  }
};