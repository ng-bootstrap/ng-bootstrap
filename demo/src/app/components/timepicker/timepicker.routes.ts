/* eslint-disable @typescript-eslint/no-var-requires */
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { NgbdExamplesPage } from '../../shared/examples-page/examples.component';
import { NgbdTimepickerAdapter } from './demos/adapter/timepicker-adapter';
import { NgbdTimepickerBasic } from './demos/basic/timepicker-basic';
import { NgbdTimepickerConfig } from './demos/config/timepicker-config';
import { NgbdTimepickerMeridian } from './demos/meridian/timepicker-meridian';
import { NgbdTimepickerSeconds } from './demos/seconds/timepicker-seconds';
import { NgbdTimepickerSpinners } from './demos/spinners/timepicker-spinners';
import { NgbdTimepickerSteps } from './demos/steps/timepicker-steps';
import { NgbdTimepickerValidation } from './demos/validation/timepicker-validation';
import { NgbdTimepickerI18n } from './demos/i18n/timepicker-i18n';
import { Routes } from '@angular/router';
import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import { NgbdDemoListService } from '../../services/demo-list.service';

const DEMOS = {
	basic: {
		title: 'Timepicker',
		type: NgbdTimepickerBasic,
		code: require('!!raw-loader!./demos/basic/timepicker-basic').default,
		markup: require('!!raw-loader!./demos/basic/timepicker-basic.html').default,
	},
	meridian: {
		title: 'Meridian',
		type: NgbdTimepickerMeridian,
		code: require('!!raw-loader!./demos/meridian/timepicker-meridian').default,
		markup: require('!!raw-loader!./demos/meridian/timepicker-meridian.html').default,
	},
	seconds: {
		title: 'Seconds',
		type: NgbdTimepickerSeconds,
		code: require('!!raw-loader!./demos/seconds/timepicker-seconds').default,
		markup: require('!!raw-loader!./demos/seconds/timepicker-seconds.html').default,
	},
	spinners: {
		title: 'Spinners',
		type: NgbdTimepickerSpinners,
		code: require('!!raw-loader!./demos/spinners/timepicker-spinners').default,
		markup: require('!!raw-loader!./demos/spinners/timepicker-spinners.html').default,
	},
	steps: {
		title: 'Custom steps',
		type: NgbdTimepickerSteps,
		code: require('!!raw-loader!./demos/steps/timepicker-steps').default,
		markup: require('!!raw-loader!./demos/steps/timepicker-steps.html').default,
	},
	validation: {
		title: 'Custom validation',
		type: NgbdTimepickerValidation,
		code: require('!!raw-loader!./demos/validation/timepicker-validation').default,
		markup: require('!!raw-loader!./demos/validation/timepicker-validation.html').default,
	},
	adapter: {
		title: 'Custom time adapter',
		type: NgbdTimepickerAdapter,
		code: require('!!raw-loader!./demos/adapter/timepicker-adapter').default,
		markup: require('!!raw-loader!./demos/adapter/timepicker-adapter.html').default,
	},
	i18n: {
		title: 'Internationalization of timepickers',
		type: NgbdTimepickerI18n,
		code: require('!!raw-loader!./demos/i18n/timepicker-i18n').default,
		markup: require('!!raw-loader!./demos/i18n/timepicker-i18n.html').default,
	},
	config: {
		title: 'Global configuration of timepickers',
		type: NgbdTimepickerConfig,
		code: require('!!raw-loader!./demos/config/timepicker-config').default,
		markup: require('!!raw-loader!./demos/config/timepicker-config.html').default,
	},
};

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'examples' },
	{
		path: '',
		component: ComponentWrapper,
		providers: [
			{
				provide: ENVIRONMENT_INITIALIZER,
				multi: true,
				useValue: () => inject(NgbdDemoListService).register('timepicker', DEMOS),
			},
		],
		children: [
			{ path: 'examples', component: NgbdExamplesPage },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
