/* eslint-disable @typescript-eslint/no-var-requires */

import { Routes } from '@angular/router';
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdExamplesPage } from '../../shared/examples-page/examples.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import { NgbdDemoListService } from '../../services/demo-list.service';
import { NgbdAlertBasic } from './demos/basic/alert-basic';
import { NgbdAlertCloseable } from './demos/closeable/alert-closeable';
import { NgbdAlertSelfclosing } from './demos/selfclosing/alert-selfclosing';
import { NgbdAlertCustom } from './demos/custom/alert-custom';
import { NgbdAlertConfig } from './demos/config/alert-config';

const DEMOS = {
	basic: {
		title: 'Basic Alert',
		type: NgbdAlertBasic,
		code: 'alert/demos/basic/alert-basic.ts',
		markup: 'alert/demos/basic/alert-basic.html',
	},
	closeable: {
		title: 'Closable Alert',
		type: NgbdAlertCloseable,
		code: 'alert/demos/closeable/alert-closeable.ts',
		markup: 'alert/demos/closeable/alert-closeable.html',
	},
	selfclosing: {
		title: 'Self closing alert',
		type: NgbdAlertSelfclosing,
		code: 'alert/demos/selfclosing/alert-selfclosing.ts',
		markup: 'alert/demos/selfclosing/alert-selfclosing.html',
	},
	custom: {
		title: 'Custom alert',
		type: NgbdAlertCustom,
		code: 'alert/demos/custom/alert-custom.ts',
		markup: 'alert/demos/custom/alert-custom.html',
	},
	config: {
		title: 'Global configuration of alerts',
		type: NgbdAlertConfig,
		code: 'alert/demos/config/alert-config.ts',
		markup: 'alert/demos/config/alert-config.html',
	},
};

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'examples' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
			name: 'Alert',
			bootstrap: 'https://getbootstrap.com/docs/%version%/components/alerts/',
		},
		providers: [
			{
				provide: ENVIRONMENT_INITIALIZER,
				multi: true,
				useValue: () => inject(NgbdDemoListService).register('alert', DEMOS),
			},
		],
		children: [
			{ path: 'examples', component: NgbdExamplesPage },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
