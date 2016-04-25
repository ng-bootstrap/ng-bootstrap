Error.stackTraceLimit = Infinity;

var appContext = require.context('./src', true, /\.spec\.ts/);

appContext.keys().forEach(appContext);

var testing = require('angular2/testing');
var browser = require('angular2/platform/testing/browser');

testing.setBaseTestProviders(browser.TEST_BROWSER_PLATFORM_PROVIDERS, browser.TEST_BROWSER_APPLICATION_PROVIDERS);