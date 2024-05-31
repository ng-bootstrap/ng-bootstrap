// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js';
import 'zone.js/testing';
import '@angular/localize/init';

import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

import './test/jasmine.config';
import { areTrackWarningsIgnored, honorTrackWarnings } from './test/common';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
	errorOnUnknownElements: true,
	errorOnUnknownProperties: true,
});

beforeEach(() => {
	honorTrackWarnings();
	const originalWarn = console.warn;
	spyOn(console, 'warn').and.callFake((message: string, ...args: any[]) => {
		if (message.includes('NG0956') || message.includes('NG0955')) {
			if (!areTrackWarningsIgnored()) {
				fail('track warning found: ' + message);
			}
		} else {
			originalWarn(message, ...args);
		}
	});
});
