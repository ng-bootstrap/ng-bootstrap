/* eslint-disable @typescript-eslint/no-var-requires */
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { NgbdExamplesPage } from '../../shared/examples-page/examples.component';
import { NgbdTypeaheadBasic } from './demos/basic/typeahead-basic';
import { NgbdTypeaheadConfig } from './demos/config/typeahead-config';
import { NgbdTypeaheadFocus } from './demos/focus/typeahead-focus';
import { NgbdTypeaheadFormat } from './demos/format/typeahead-format';
import { NgbdTypeaheadHttp } from './demos/http/typeahead-http';
import { NgbdTypeaheadSelectOnExact } from './demos/select-on-exact/typeahead-select-on-exact';
import { NgbdTypeaheadTemplate } from './demos/template/typeahead-template';
import { NgbdTypeaheadPreventManualEntry } from './demos/prevent-manual-entry/typeahead-prevent-manual-entry';
import { Routes } from '@angular/router';
import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import { NgbdDemoListService } from '../../services/demo-list.service';

const DEMOS = {
	basic: {
		title: 'Simple Typeahead',
		type: NgbdTypeaheadBasic,
		code: 'typeahead/demos/basic/typeahead-basic.ts',
		markup: 'typeahead/demos/basic/typeahead-basic.html',
	},
	focus: {
		title: 'Open on focus',
		type: NgbdTypeaheadFocus,
		code: 'typeahead/demos/focus/typeahead-focus.ts',
		markup: 'typeahead/demos/focus/typeahead-focus.html',
	},
	format: {
		title: 'Formatted results',
		type: NgbdTypeaheadFormat,
		code: 'typeahead/demos/format/typeahead-format.ts',
		markup: 'typeahead/demos/format/typeahead-format.html',
	},
	'select-on-exact': {
		title: 'Select on exact',
		type: NgbdTypeaheadSelectOnExact,
		code: 'typeahead/demos/select-on-exact/typeahead-select-on-exact.ts',
		markup: 'typeahead/demos/select-on-exact/typeahead-select-on-exact.html',
	},
	http: {
		title: 'Wikipedia search',
		type: NgbdTypeaheadHttp,
		code: 'typeahead/demos/http/typeahead-http.ts',
		markup: 'typeahead/demos/http/typeahead-http.html',
	},
	template: {
		title: 'Template for results',
		type: NgbdTypeaheadTemplate,
		code: 'typeahead/demos/template/typeahead-template.ts',
		markup: 'typeahead/demos/template/typeahead-template.html',
	},
	'prevent-manual-entry': {
		title: 'Prevent manual entry',
		type: NgbdTypeaheadPreventManualEntry,
		code: 'typeahead/demos/prevent-manual-entry/typeahead-prevent-manual-entry.ts',
		markup: 'typeahead/demos/prevent-manual-entry/typeahead-prevent-manual-entry.html',
	},
	config: {
		title: 'Global configuration of typeaheads',
		type: NgbdTypeaheadConfig,
		code: 'typeahead/demos/config/typeahead-config.ts',
		markup: 'typeahead/demos/config/typeahead-config.html',
	},
};

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'examples' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
			name: 'Typeahead',
		},
		providers: [
			{
				provide: ENVIRONMENT_INITIALIZER,
				multi: true,
				useValue: () => inject(NgbdDemoListService).register('typeahead', DEMOS),
			},
		],
		children: [
			{ path: 'examples', component: NgbdExamplesPage },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
