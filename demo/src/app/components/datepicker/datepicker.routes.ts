/* eslint-disable @typescript-eslint/no-var-requires */
import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdDemoListService } from '../../services/demo-list.service';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { NgbdExamplesPage } from '../../shared/examples-page/examples.component';
import { NgbdDatepickerCalendarsComponent } from './calendars/datepicker-calendars.component';
import { NgbdDatepickerAdapter } from './demos/adapter/datepicker-adapter';
import { NgbdDatepickerBasic } from './demos/basic/datepicker-basic';
import { NgbdDatepickerConfig } from './demos/config/datepicker-config';
import { NgbdDatepickerCustomday } from './demos/customday/datepicker-customday';
import { NgbdDatepickerDisabled } from './demos/disabled/datepicker-disabled';
import { NgbdDatepickerFootertemplate } from './demos/footertemplate/datepicker-footertemplate';
import { NgbdDatepickerI18n } from './demos/i18n/datepicker-i18n';
import { NgbdDatepickerCustommonth } from './demos/custommonth/datepicker-custommonth';
import { NgbdDatepickerMultiple } from './demos/multiple/datepicker-multiple';
import { NgbdDatepickerPopup } from './demos/popup/datepicker-popup';
import { NgbdDatepickerRange } from './demos/range/datepicker-range';
import { NgbdDatepickerRangePopup } from './demos/range-popup/datepicker-range-popup';
import { NgbdDatepickerOverviewComponent } from './overview/datepicker-overview.component';
import { NgbdDatepickerPositiontarget } from './demos/positiontarget/datepicker-positiontarget';
import { NgbdDatepickerKeyboard } from './demos/keyboard/datepicker-keyboard';
import { Routes } from '@angular/router';

const OVERVIEW = {
	'basic-usage': 'Basic Usage',
	'getting-date': 'Getting/setting a date',
	'date-model': 'Date model and format',
	navigation: 'Moving around',
	'limiting-dates': 'Disabling and limiting dates',
	'day-template': 'Day display customization',
	today: "Today's date",
	'content-template': 'Content Template',
	'footer-template': 'Custom footer',
	range: 'Range selection',
	i18n: 'Internationalization',
	'keyboard-shortcuts': 'Keyboard shortcuts',
};

const DEMOS = {
	basic: {
		title: 'Basic datepicker',
		type: NgbdDatepickerBasic,
		code: 'datepicker/demos/basic/datepicker-basic.ts',
		markup: 'datepicker/demos/basic/datepicker-basic.html',
	},
	popup: {
		title: 'Datepicker in a popup',
		type: NgbdDatepickerPopup,
		code: 'datepicker/demos/popup/datepicker-popup.ts',
		markup: 'datepicker/demos/popup/datepicker-popup.html',
	},
	multiple: {
		title: 'Multiple months',
		type: NgbdDatepickerMultiple,
		code: 'datepicker/demos/multiple/datepicker-multiple.ts',
		markup: 'datepicker/demos/multiple/datepicker-multiple.html',
	},
	range: {
		title: 'Range selection',
		type: NgbdDatepickerRange,
		code: 'datepicker/demos/range/datepicker-range.ts',
		markup: 'datepicker/demos/range/datepicker-range.html',
	},
	'range-popup': {
		title: 'Range selection in a popup',
		type: NgbdDatepickerRangePopup,
		code: 'datepicker/demos/range-popup/datepicker-range-popup.ts',
		markup: 'datepicker/demos/range-popup/datepicker-range-popup.html',
	},
	disabled: {
		title: 'Disabled datepicker',
		type: NgbdDatepickerDisabled,
		code: 'datepicker/demos/disabled/datepicker-disabled.ts',
		markup: 'datepicker/demos/disabled/datepicker-disabled.html',
	},
	adapter: {
		title: 'Custom date adapter and formatter',
		type: NgbdDatepickerAdapter,
		code: 'datepicker/demos/adapter/datepicker-adapter.ts',
		markup: 'datepicker/demos/adapter/datepicker-adapter.html',
	},
	i18n: {
		title: 'Internationalization of datepickers',
		type: NgbdDatepickerI18n,
		code: 'datepicker/demos/i18n/datepicker-i18n.ts',
		markup: 'datepicker/demos/i18n/datepicker-i18n.html',
	},
	customday: {
		title: 'Custom day view',
		type: NgbdDatepickerCustomday,
		code: 'datepicker/demos/customday/datepicker-customday.ts',
		markup: 'datepicker/demos/customday/datepicker-customday.html',
	},
	custommonth: {
		title: 'Custom month layout',
		type: NgbdDatepickerCustommonth,
		code: 'datepicker/demos/custommonth/datepicker-custommonth.ts',
		markup: 'datepicker/demos/custommonth/datepicker-custommonth.html',
	},
	footertemplate: {
		title: 'Footer template',
		type: NgbdDatepickerFootertemplate,
		code: 'datepicker/demos/footertemplate/datepicker-footertemplate.ts',
		markup: 'datepicker/demos/footertemplate/datepicker-footertemplate.html',
	},
	positiontarget: {
		title: 'Position target',
		type: NgbdDatepickerPositiontarget,
		code: 'datepicker/demos/positiontarget/datepicker-positiontarget.ts',
		markup: 'datepicker/demos/positiontarget/datepicker-positiontarget.html',
	},
	keyboard: {
		title: 'Custom keyboard navigation',
		type: NgbdDatepickerKeyboard,
		code: 'datepicker/demos/keyboard/datepicker-keyboard.ts',
		markup: 'datepicker/demos/keyboard/datepicker-keyboard.html',
	},
	config: {
		title: 'Global configuration of datepickers',
		type: NgbdDatepickerConfig,
		code: 'datepicker/demos/config/datepicker-config.ts',
		markup: 'datepicker/demos/config/datepicker-config.html',
	},
};

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'overview' },
	{
		path: '',
		component: ComponentWrapper,
		providers: [
			{
				provide: ENVIRONMENT_INITIALIZER,
				multi: true,
				useValue: () => inject(NgbdDemoListService).register('datepicker', DEMOS, OVERVIEW),
			},
		],
		children: [
			{ path: 'overview', component: NgbdDatepickerOverviewComponent },
			{ path: 'examples', component: NgbdExamplesPage },
			{ path: 'calendars', component: NgbdDatepickerCalendarsComponent },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
