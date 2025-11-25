// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js';
import 'zone.js/testing';

import { getTestBed } from '@angular/core/testing';

import './test/jasmine.config';
import { areTrackWarningsIgnored, honorTrackWarnings } from './test/common';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { provideZoneChangeDetection } from '@angular/core';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting(), {
	errorOnUnknownElements: true,
	errorOnUnknownProperties: true,
});

beforeEach(() => {
	honorTrackWarnings();
	const originalWarn = console.warn;
	getTestBed().configureTestingModule({ providers: [provideZoneChangeDetection()] });
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
