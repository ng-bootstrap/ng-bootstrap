import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { NgbdExamplesPageComponent } from '../../shared/examples-page/examples-page.component';
import { NgbdTypeaheadBasic } from './demos/basic/typeahead-basic';
import { NgbdTypeaheadConfig } from './demos/config/typeahead-config';
import { NgbdTypeaheadFocus } from './demos/focus/typeahead-focus';
import { NgbdTypeaheadFormat } from './demos/format/typeahead-format';
import { NgbdTypeaheadHttp } from './demos/http/typeahead-http';
import { NgbdTypeaheadSelectOnExact } from './demos/select-on-exact/typeahead-select-on-exact';
import { NgbdTypeaheadTemplate } from './demos/template/typeahead-template';
import { NgbdTypeaheadPreventManualEntry } from './demos/prevent-manual-entry/typeahead-prevent-manual-entry';
import { Routes } from '@angular/router';
import { COMPONENT_DATA, ComponentData } from '../../tokens';

const DATA: ComponentData = {
	name: 'Typeahead',
	overview: {},
	demos: [
		{
			fragment: 'basic',
			title: 'Simple Typeahead',
			type: NgbdTypeaheadBasic,
			code: 'typeahead/demos/basic/typeahead-basic.ts',
			markup: 'typeahead/demos/basic/typeahead-basic.html',
		},
		{
			fragment: 'focus',
			title: 'Open on focus',
			type: NgbdTypeaheadFocus,
			code: 'typeahead/demos/focus/typeahead-focus.ts',
			markup: 'typeahead/demos/focus/typeahead-focus.html',
		},
		{
			fragment: 'format',
			title: 'Formatted results',
			type: NgbdTypeaheadFormat,
			code: 'typeahead/demos/format/typeahead-format.ts',
			markup: 'typeahead/demos/format/typeahead-format.html',
		},
		{
			fragment: 'select-on-exact',
			title: 'Select on exact',
			type: NgbdTypeaheadSelectOnExact,
			code: 'typeahead/demos/select-on-exact/typeahead-select-on-exact.ts',
			markup: 'typeahead/demos/select-on-exact/typeahead-select-on-exact.html',
		},
		{
			fragment: 'http',
			title: 'Wikipedia search',
			type: NgbdTypeaheadHttp,
			code: 'typeahead/demos/http/typeahead-http.ts',
			markup: 'typeahead/demos/http/typeahead-http.html',
		},
		{
			fragment: 'template',
			title: 'Template for results',
			type: NgbdTypeaheadTemplate,
			code: 'typeahead/demos/template/typeahead-template.ts',
			markup: 'typeahead/demos/template/typeahead-template.html',
		},
		{
			fragment: 'prevent-manual-entry',
			title: 'Prevent manual entry',
			type: NgbdTypeaheadPreventManualEntry,
			code: 'typeahead/demos/prevent-manual-entry/typeahead-prevent-manual-entry.ts',
			markup: 'typeahead/demos/prevent-manual-entry/typeahead-prevent-manual-entry.html',
		},
		{
			fragment: 'config',
			title: 'Global configuration of typeaheads',
			type: NgbdTypeaheadConfig,
			code: 'typeahead/demos/config/typeahead-config.ts',
			markup: 'typeahead/demos/config/typeahead-config.html',
		},
	],
};

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'examples' },
	{
		path: '',
		component: ComponentWrapper,
		providers: [{ provide: COMPONENT_DATA, useValue: DATA }],
		children: [
			{ path: 'examples', component: NgbdExamplesPageComponent },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
