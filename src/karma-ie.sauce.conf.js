// Configuration used testing via Sauce Labs on Travis CI

process.env.SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY.split('').reverse().join('');

const BROWSERS = {
  'SL_IE10': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8',
    version: '10'
  },
  'SL_IE11': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 10',
    version: '11'
  },
};

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-sauce-launcher'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    angularCli: {
      environment: 'dev'
    },

    sauceLabs: {
      build: `TRAVIS #${process.env.TRAVIS_BUILD_NUMBER} (${process.env.TRAVIS_BUILD_ID})`,
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
      testName: 'ng-bootstrap/ie',
      retryLimit: 3,
      startConnect: false,
      recordVideo: false,
      recordScreenshots: false,
      options: {
        'command-timeout': 600,
        'idle-timeout': 600,
        'max-duration': 5400
      }
    },

    customLaunchers: BROWSERS,

    reporters: ['dots', 'saucelabs'],

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: Object.keys(BROWSERS),
    singleRun: true,
    captureTimeout: 180000,
    browserDisconnectTimeout: 180000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 300000
  });
};
