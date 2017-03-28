module.exports = function(config) {
  config.set({

    basePath: '',

    frameworks: ['jasmine'],

    files: [
      // For travis
      // IE9, IE10 and IE11 polyfills
      'node_modules/core-js/es6/symbol.js',
      'node_modules/core-js/es6/object.js',
      'node_modules/core-js/es6/function.js',
      'node_modules/core-js/es6/parse-int.js',
      'node_modules/core-js/es6/parse-float.js',
      'node_modules/core-js/es6/number.js',
      'node_modules/core-js/es6/math.js',
      'node_modules/core-js/es6/string.js',
      'node_modules/core-js/es6/date.js',
      'node_modules/core-js/es6/array.js',
      'node_modules/core-js/es6/regexp.js',
      'node_modules/core-js/es6/map.js',
      'node_modules/core-js/es6/set.js',
      'node_modules/core-js/es6/reflect.js',
      'node_modules/core-js/es7/reflect.js',
      // paths loaded by Karma
      'node_modules/systemjs/dist/system-polyfills.js',
      'node_modules/systemjs/dist/system.src.js',
      'node_modules/zone.js/dist/zone.js',
      'node_modules/zone.js/dist/long-stack-trace-zone.js',
      'node_modules/zone.js/dist/proxy.js',
      'node_modules/zone.js/dist/sync-test.js',
      'node_modules/zone.js/dist/jasmine-patch.js',
      'node_modules/zone.js/dist/async-test.js',
      'node_modules/zone.js/dist/fake-async-test.js',
      {pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false},
      {pattern: 'node_modules/rxjs/**/*.js.map', included: false, watched: false},
      {pattern: 'karma-test-shim.js', included: true, watched: true},
      {pattern: 'node_modules/@angular/**/*.js', included: false, watched: true},
      {pattern: 'node_modules/@angular/**/*.js.map', included: false, watched: true},

      // paths loaded via module imports
      {pattern: 'temp/**/*.js', included: false, watched: true},

      // paths to support debugging with source maps in dev tools
      {pattern: 'src/**/*.ts', included: false, watched: false},
      {pattern: 'temp/**/*.js.map', included: false, watched: false}
    ],

    preprocessors: {
      'temp/**/*.js': 'sourcemap',
      'temp/**/!(*.spec|*.module).js': 'coverage'
    },

    customLaunchers: {
      'SL_CHROME': {
        base: 'SauceLabs',
        browserName: 'chrome',
        version: 'latest'
      },
      'SL_FIREFOX': {
        base: 'SauceLabs',
        browserName: 'firefox',
        version: 'latest'
      },
      'SL_IE10': {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 2012',
        version: '10'
      },
      'SL_IE11': {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8.1',
        version: '11'
      },
      'SL_EDGE13': {
        base: 'SauceLabs',
        browserName: 'MicrosoftEdge',
        platform: 'Windows 10',
        version: '13.10586'
      },
      'SL_EDGE14': {
        base: 'SauceLabs',
        browserName: 'MicrosoftEdge',
        platform: 'Windows 10',
        version: '14.14393'
      },
      'SL_SAFARI9': {
        base: 'SauceLabs',
        browserName: 'safari',
        platform: 'OS X 10.11',
        version: '9.0'
      },
      'SL_SAFARI10': {
        base: 'SauceLabs',
        browserName: 'safari',
        platform: 'OS X 10.11',
        version: '10.0'
      }
    },

    sauceLabs: {
      testName: 'ng-bootstrap',
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

    reporters: ['progress', 'coverage'],

    coverageReporter: {
      dir: 'coverage/',
      reporters: [{
        type: 'json',
        dir: 'coverage',
        subdir: 'json',
        file: 'coverage-final.json'
      }]
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    captureTimeout: 60000,
    browserDisconnectTimeout: 60000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 60000
  });
};
