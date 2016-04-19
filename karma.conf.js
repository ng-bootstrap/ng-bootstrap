var webpackConfig = require('./webpack.test');

module.exports = function(config) {
  config.set({

    basePath: '',

    frameworks: ['jasmine'],

    files: [
      {pattern: 'node_modules/es6-shim/es6-shim.js', included: true, watched: false},
      {pattern: 'node_modules/angular2/bundles/angular2-polyfills.js', included: true, watched: false},
      {pattern: './karma-test-shim.js', watched: false}
    ],

    preprocessors: {'./karma-test-shim.js': ['webpack', 'sourcemap']},
    
    webpack: webpackConfig,
    
    webpackMiddleware: {
      stats: 'errors-only'
    },

    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
