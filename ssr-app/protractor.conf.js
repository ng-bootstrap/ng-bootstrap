// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

const chromeArgs = process.env.TRAVIS ? [
  '--headless',
  '--no-sandbox',
  '--window-size=1280x800'
] : [];

const jasmineNodeOpts = {
  showColors: true,
  defaultTimeoutInterval: 30000
};

if (!process.env.TRAVIS) {
  jasmineNodeOpts.print = function() {};
}

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './src/**/*.e2e-spec.ts'
  ],
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: chromeArgs
    }
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts,
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.spec.json')
    });

    if (!process.env.TRAVIS) {
      jasmine.getEnv().addReporter(new SpecReporter({spec: {displayStacktrace: 'pretty'}}));
    }
  }
};
