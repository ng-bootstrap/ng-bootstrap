var path = require('path');

module.exports = {
  devtool: 'inline-source-map',
  
  resolve: {
    extensions: ['', '.js', '.ts'],
  },
  
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts',
        exclude: /node_modules/
      }
    ]
  }
};