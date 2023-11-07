/* eslint-disable @typescript-eslint/no-var-requires */
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { NgbdExamplesPage } from '../../shared/examples-page/examples.component';
import { NgbdToastCloseable } from './demos/closeable/toast-closeable';
import { NgbdToastCustomHeader } from './demos/custom-header/toast-custom-header';
import { NgbdToastGlobal } from './demos/howto-global/toast-global.component';
import { NgbdToastInline } from './demos/inline/toast-inline';
import { NgbdToastPreventAutohide } from './demos/prevent-autohide/toast-prevent-autohide';
import { NgbdToastOverviewComponent } from './overview/toast-overview.component';
import { versions } from '../../../environments/versions';
import { Routes } from '@angular/router';
import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import { NgbdDemoListService } from '../../services/demo-list.service';

const OVERVIEW = {
	'inline-usage': 'Declarative usage',
	'toast-service': 'Building a toast management service',
};

const DEMOS = {
	inline: {
		title: 'Declarative inline usage',
		type: NgbdToastInline,
		code: 'toast/demos/inline/toast-inline.ts',
		markup: 'toast/demos/inline/toast-inline.html',
	},
	'custom-header': {
		title: 'Using a Template as header',
		type: NgbdToastCustomHeader,
		code: 'toast/demos/custom-header/toast-custom-header.ts',
		markup: 'toast/demos/custom-header/toast-custom-header.html',
	},
	closeable: {
		title: 'Closeable toast',
		type: NgbdToastCloseable,
		code: 'toast/demos/closeable/toast-closeable.ts',
		markup: 'toast/demos/closeable/toast-closeable.html',
	},
	'prevent-autohide': {
		title: 'Prevent autohide on mouseover',
		type: NgbdToastPreventAutohide,
		code: 'toast/demos/prevent-autohide/toast-prevent-autohide.ts',
		markup: 'toast/demos/prevent-autohide/toast-prevent-autohide.html',
	},
	'howto-global': {
		title: 'Toast management service',
		type: NgbdToastGlobal,
		files: [
			{
				name: 'toast-service.ts',
				source: 'toast/demos/howto-global/toast-service.ts',
			},
			{
				name: 'toast-global.component.html',
				source: 'toast/demos/howto-global/toast-global.component.html',
			},
			{
				name: 'toast-global.component.ts',
				source: 'toast/demos/howto-global/toast-global.component.ts',
			},
			{
				name: 'toasts-container.component.ts',
				source: 'toast/demos/howto-global/toasts-container.component.ts',
			},
		],
	},
};

const bsVersion = versions.bootstrap;

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'overview' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
			bootstrap: `https://getbootstrap.com/docs/${bsVersion}/components/toasts/`,
		},
		providers: [
			{
				provide: ENVIRONMENT_INITIALIZER,
				multi: true,
				useValue: () => inject(NgbdDemoListService).register('toast', DEMOS, OVERVIEW),
			},
		],
		children: [
			{ path: 'overview', component: NgbdToastOverviewComponent },
			{ path: 'examples', component: NgbdExamplesPage },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
