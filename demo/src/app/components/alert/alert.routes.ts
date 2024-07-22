import { Routes } from '@angular/router';
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdExamplesPageComponent } from '../../shared/examples-page/examples-page.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { NgbdAlertBasic } from './demos/basic/alert-basic';
import { NgbdAlertCloseable } from './demos/closeable/alert-closeable';
import { NgbdAlertSelfclosing } from './demos/selfclosing/alert-selfclosing';
import { NgbdAlertCustom } from './demos/custom/alert-custom';
import { NgbdAlertConfig } from './demos/config/alert-config';
import { COMPONENT_DATA, ComponentData } from '../../tokens';

const DATA: ComponentData = {
	name: 'Alert',
	bootstrapUrl: 'https://getbootstrap.com/docs/%version%/components/alerts/',
	overview: {},
	demos: [
		{
			fragment: 'basic',
			title: 'Basic Alert',
			type: NgbdAlertBasic,
			code: 'alert/demos/basic/alert-basic.ts',
			markup: 'alert/demos/basic/alert-basic.html',
		},
		{
			fragment: 'closeable',
			title: 'Closable Alert',
			type: NgbdAlertCloseable,
			code: 'alert/demos/closeable/alert-closeable.ts',
			markup: 'alert/demos/closeable/alert-closeable.html',
		},
		{
			fragment: 'selfclosing',
			title: 'Self closing alert',
			type: NgbdAlertSelfclosing,
			code: 'alert/demos/selfclosing/alert-selfclosing.ts',
			markup: 'alert/demos/selfclosing/alert-selfclosing.html',
		},
		{
			fragment: 'custom',
			title: 'Custom alert',
			type: NgbdAlertCustom,
			code: 'alert/demos/custom/alert-custom.ts',
			markup: 'alert/demos/custom/alert-custom.html',
		},
		{
			fragment: 'config',
			title: 'Global configuration of alerts',
			type: NgbdAlertConfig,
			code: 'alert/demos/config/alert-config.ts',
			markup: 'alert/demos/config/alert-config.html',
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
