// Configuration used for local testing and Travis CI

const reporters = process.env.TRAVIS ? ['dots'] : ['progress'];
const browsers = process.env.TRAVIS ? ['ChromeHeadlessNoSandbox'] : ['ChromeNoExtensions'];

module.exports = function (config) {
  config.set({
    basePath: '',
    files: ['../node_modules/bootstrap/dist/css/bootstrap.min.css', '../src/test/test-styles.css'],
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-ie-launcher',
      'karma-coverage-istanbul-reporter',
      '@angular-devkit/build-angular/plugins/karma'
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
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
      },
      IENoExtensions: {
        base: 'IE',
        flags: ['-extoff', '-k']
      }
    },
    reporters,
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers,
    singleRun: false,
    restartOnFileChange: true,
    browserNoActivityTimeout: 20000
  });
};
