/* eslint-disable @typescript-eslint/no-var-requires */
import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdDemoListService } from '../../services/demo-list.service';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { NgbdExamplesPage } from '../../shared/examples-page/examples.component';
import { NgbdMonthpickerAdapter } from './demos/adapter/monthpicker-adapter';
import { NgbdMonthpickerBasic } from './demos/basic/monthpicker-basic';
import { NgbdMonthpickerConfig } from './demos/config/monthpicker-config';
import { NgbdMonthpickerDisabled } from './demos/disabled/monthpicker-disabled';
import { NgbdMonthpickerFootertemplate } from './demos/footertemplate/monthpicker-footertemplate';
import { NgbdMonthpickerI18n } from './demos/i18n/monthpicker-i18n';
import { NgbdMonthpickerPopup } from './demos/popup/monthpicker-popup';
import { NgbdMonthpickerOverviewComponent } from './overview/monthpicker-overview.component';
import { NgbdMonthpickerPositiontarget } from './demos/positiontarget/monthpicker-positiontarget';
import { NgbdMonthpickerKeyboard } from './demos/keyboard/monthpicker-keyboard';
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
		title: 'Basic monthpicker',
		type: NgbdMonthpickerBasic,
		code: require('!!raw-loader!./demos/basic/monthpicker-basic').default,
		markup: require('!!raw-loader!./demos/basic/monthpicker-basic.html').default,
	},
	popup: {
		title: 'Monthpicker in a popup',
		type: NgbdMonthpickerPopup,
		code: require('!!raw-loader!./demos/popup/monthpicker-popup').default,
		markup: require('!!raw-loader!./demos/popup/monthpicker-popup.html').default,
	},
	disabled: {
		title: 'Disabled monthpicker',
		type: NgbdMonthpickerDisabled,
		code: require('!!raw-loader!./demos/disabled/monthpicker-disabled').default,
		markup: require('!!raw-loader!./demos/disabled/monthpicker-disabled.html').default,
	},
	adapter: {
		title: 'Custom month adapter and formatter',
		type: NgbdMonthpickerAdapter,
		code: require('!!raw-loader!./demos/adapter/monthpicker-adapter').default,
		markup: require('!!raw-loader!./demos/adapter/monthpicker-adapter.html').default,
	},
	i18n: {
		title: 'Internationalization of monthpickers',
		type: NgbdMonthpickerI18n,
		code: require('!!raw-loader!./demos/i18n/monthpicker-i18n').default,
		markup: require('!!raw-loader!./demos/i18n/monthpicker-i18n.html').default,
	},
	footertemplate: {
		title: 'Footer template',
		type: NgbdMonthpickerFootertemplate,
		code: require('!!raw-loader!./demos/footertemplate/monthpicker-footertemplate').default,
		markup: require('!!raw-loader!./demos/footertemplate/monthpicker-footertemplate.html').default,
	},
	positiontarget: {
		title: 'Position target',
		type: NgbdMonthpickerPositiontarget,
		code: require('!!raw-loader!./demos/positiontarget/monthpicker-positiontarget').default,
		markup: require('!!raw-loader!./demos/positiontarget/monthpicker-positiontarget.html').default,
	},
	keyboard: {
		title: 'Custom keyboard navigation',
		type: NgbdMonthpickerKeyboard,
		code: require('!!raw-loader!./demos/keyboard/monthpicker-keyboard').default,
		markup: require('!!raw-loader!./demos/keyboard/monthpicker-keyboard.html').default,
	},
	config: {
		title: 'Global configuration of monthpickers',
		type: NgbdMonthpickerConfig,
		code: require('!!raw-loader!./demos/config/monthpicker-config').default,
		markup: require('!!raw-loader!./demos/config/monthpicker-config.html').default,
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
				useValue: () => inject(NgbdDemoListService).register('monthpicker', DEMOS, OVERVIEW),
			},
		],
		children: [
			{ path: 'overview', component: NgbdMonthpickerOverviewComponent },
			{ path: 'examples', component: NgbdExamplesPage },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
