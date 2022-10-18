// Configuration used testing via Sauce Labs on GitHub CI

process.env.SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY.split('').reverse().join('');

const BROWSERS = {
  'CHROME': {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: 'latest'
  },
  // 'FIREFOX': {
  //   base: 'SauceLabs',
  //   browserName: 'firefox',
  //   version: 'latest',
  // },
  'EDGE': {
    base: 'SauceLabs',
    browserName: 'MicrosoftEdge',
    platform: 'Windows 10',
    version: 'latest'
  },
  'SAFARI13': {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'macOS 10.15',
    version: '13'
  },
  'SAFARI14': {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'macOS 11.00',
    version: '14'
  }
};

module.exports = function (config) {
  config.set({
    basePath: '',
    files: ['../node_modules/bootstrap/dist/css/bootstrap.min.css', '../src/test/test-styles.css'],
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-sauce-launcher'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    sauceLabs: {
      build: `GitHub run #${process.env.GITHUB_RUN_ID}`,
      tunnelIdentifier: process.env.GITHUB_RUN_ID,
      testName: 'ng-bootstrap',
      retryLimit: 3,
      startConnect: false,
      recordVideo: false,
      recordScreenshots: false,
      options: {
        commandTimeout: 600,
        idleTimeout: 600,
        maxDuration: 5400
      }
    },

    customLaunchers: BROWSERS,

    reporters: ['dots', 'saucelabs'],

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['CHROME', 'EDGE', 'SAFARI13', 'SAFARI14'],
    autoWatch: false,
    singleRun: true,
    captureTimeout: 180000,
    browserDisconnectTimeout: 180000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 300000
  });
};
