var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'angular2': [
      'zone.js',
      'reflect-metadata',
      'angular2/angular2'
    ],
    'app': [
      './demo/src/demo.ts'
    ]
  },
  output: {
    path: __dirname + '/demo/dist',
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js'
  },
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  devtool: 'eval',
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'angular2',
      minChunks: Infinity,
      filename: 'angular2.bundle.js'
    }),
    new HtmlWebpackPlugin({
      template: './demo/src/index.html',
      inject: 'body'
    })
  ],
  devServer: {
    contentBase: './demo/dist',
    stats: {
      modules: false,
      cached: false,
      colors: true,
      chunk: false
    }
  }
};
