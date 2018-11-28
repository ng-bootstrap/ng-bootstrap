// Configuration used for local testing and Travis CI

const reporters = process.env.TRAVIS ? ['dots'] : ['progress'];
const browsers = process.env.TRAVIS ? ['ChromeHeadlessNoSandbox'] : ['ChromeNoExtensions'];

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '..', 'coverage'),
      reports: ['html', 'json', 'lcovonly'],
      fixWebpackSourcePaths: true
    },
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      },
      ChromeNoExtensions: {
        base: 'Chrome',
        flags: ['--disable-extensions']
      }
    },
    reporters,
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers,
    singleRun: false,
    browserNoActivityTimeout: 20000
  });
};
