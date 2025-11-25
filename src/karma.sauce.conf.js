// Configuration used testing via Sauce Labs on GitHub CI

const BROWSERS = {
	CHROME: {
		base: 'SauceLabs',
		browserName: 'chrome',
		browserVersion: 'latest',
	},
	FIREFOX: {
		base: 'SauceLabs',
		browserName: 'firefox',
		browserVersion: 'latest',
	},
	EDGE: {
		base: 'SauceLabs',
		browserName: 'MicrosoftEdge',
		browserVersion: 'latest',
		platformName: 'Windows 11',
	},
	SAFARI17: {
		base: 'SauceLabs',
		browserName: 'safari',
		browserVersion: '17',
		platformName: 'macOS 13',
	},
};

module.exports = function (config) {
	config.set({
		basePath: '',
		files: ['../node_modules/bootstrap/dist/css/bootstrap.min.css', '../src/test/test-styles.css'],
		frameworks: ['jasmine', '@angular-devkit/build-angular'],
		plugins: [
			require('karma-jasmine'),
			require('karma-sauce-launcher'),
			require('@angular-devkit/build-angular/plugins/karma'),
		],
		client: {
			clearContext: false, // leave Jasmine Spec Runner output visible in browser
		},
		sauceLabs: {
			build: `GitHub run #${process.env.GITHUB_RUN_ID}`,
			tunnelIdentifier: process.env.GITHUB_RUN_ID,
			testName: 'ng-bootstrap',
			retryLimit: 3,
			startConnect: false,
			recordVideo: false,
			recordScreenshots: false,
			commandTimeout: 600,
			idleTimeout: 600,
			maxDuration: 5400,
		},

		customLaunchers: BROWSERS,

		reporters: ['dots', 'saucelabs'],

		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		browsers: ['CHROME', 'FIREFOX', 'EDGE', 'SAFARI16', 'SAFARI17'],
		autoWatch: false,
		singleRun: true,
		captureTimeout: 180000,
		browserDisconnectTimeout: 180000,
		browserDisconnectTolerance: 3,
		browserNoActivityTimeout: 300000,
	});
};
