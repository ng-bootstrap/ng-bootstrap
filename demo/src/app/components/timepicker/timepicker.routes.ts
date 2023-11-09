/* eslint-disable @typescript-eslint/no-var-requires */
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { DemoListComponent } from '../../shared/examples-page/demo-list.component';
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

const DEMOS = [
	{
		fragment: 'basic',
		title: 'Timepicker',
		type: NgbdTimepickerBasic,
		code: 'timepicker/demos/basic/timepicker-basic.ts',
		markup: 'timepicker/demos/basic/timepicker-basic.html',
	},
	{
		fragment: 'meridian',
		title: 'Meridian',
		type: NgbdTimepickerMeridian,
		code: 'timepicker/demos/meridian/timepicker-meridian.ts',
		markup: 'timepicker/demos/meridian/timepicker-meridian.html',
	},
	{
		fragment: 'seconds',
		title: 'Seconds',
		type: NgbdTimepickerSeconds,
		code: 'timepicker/demos/seconds/timepicker-seconds.ts',
		markup: 'timepicker/demos/seconds/timepicker-seconds.html',
	},
	{
		fragment: 'spinners',
		title: 'Spinners',
		type: NgbdTimepickerSpinners,
		code: 'timepicker/demos/spinners/timepicker-spinners.ts',
		markup: 'timepicker/demos/spinners/timepicker-spinners.html',
	},
	{
		fragment: 'steps',
		title: 'Custom steps',
		type: NgbdTimepickerSteps,
		code: 'timepicker/demos/steps/timepicker-steps.ts',
		markup: 'timepicker/demos/steps/timepicker-steps.html',
	},
	{
		fragment: 'validation',
		title: 'Custom validation',
		type: NgbdTimepickerValidation,
		code: 'timepicker/demos/validation/timepicker-validation.ts',
		markup: 'timepicker/demos/validation/timepicker-validation.html',
	},
	{
		fragment: 'adapter',
		title: 'Custom time adapter',
		type: NgbdTimepickerAdapter,
		code: 'timepicker/demos/adapter/timepicker-adapter.ts',
		markup: 'timepicker/demos/adapter/timepicker-adapter.html',
	},
	{
		fragment: 'i18n',
		title: 'Internationalization of timepickers',
		type: NgbdTimepickerI18n,
		code: 'timepicker/demos/i18n/timepicker-i18n.ts',
		markup: 'timepicker/demos/i18n/timepicker-i18n.html',
	},
	{
		fragment: 'config',
		title: 'Global configuration of timepickers',
		type: NgbdTimepickerConfig,
		code: 'timepicker/demos/config/timepicker-config.ts',
		markup: 'timepicker/demos/config/timepicker-config.html',
	},
];

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'examples' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
			name: 'Timepicker',
		},
		children: [
			{ path: 'examples', component: DemoListComponent, data: { demos: DEMOS } },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
