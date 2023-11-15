import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { DemoListComponent } from '../../shared/examples-page/demo-list.component';
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
import { DEMOS as CALENDAR_DEMOS } from './calendars/datepicker-calendars.component';

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

const DEMOS = [
	{
		fragment: 'basic',
		title: 'Basic datepicker',
		type: NgbdDatepickerBasic,
		code: 'datepicker/demos/basic/datepicker-basic.ts',
		markup: 'datepicker/demos/basic/datepicker-basic.html',
	},
	{
		fragment: 'popup',
		title: 'Datepicker in a popup',
		type: NgbdDatepickerPopup,
		code: 'datepicker/demos/popup/datepicker-popup.ts',
		markup: 'datepicker/demos/popup/datepicker-popup.html',
	},
	{
		fragment: 'multiple',
		title: 'Multiple months',
		type: NgbdDatepickerMultiple,
		code: 'datepicker/demos/multiple/datepicker-multiple.ts',
		markup: 'datepicker/demos/multiple/datepicker-multiple.html',
	},
	{
		fragment: 'range',
		title: 'Range selection',
		type: NgbdDatepickerRange,
		code: 'datepicker/demos/range/datepicker-range.ts',
		markup: 'datepicker/demos/range/datepicker-range.html',
	},
	{
		fragment: 'range-popup',
		title: 'Range selection in a popup',
		type: NgbdDatepickerRangePopup,
		code: 'datepicker/demos/range-popup/datepicker-range-popup.ts',
		markup: 'datepicker/demos/range-popup/datepicker-range-popup.html',
	},
	{
		fragment: 'disabled',
		title: 'Disabled datepicker',
		type: NgbdDatepickerDisabled,
		code: 'datepicker/demos/disabled/datepicker-disabled.ts',
		markup: 'datepicker/demos/disabled/datepicker-disabled.html',
	},
	{
		fragment: 'adapter',
		title: 'Custom date adapter and formatter',
		type: NgbdDatepickerAdapter,
		code: 'datepicker/demos/adapter/datepicker-adapter.ts',
		markup: 'datepicker/demos/adapter/datepicker-adapter.html',
	},
	{
		fragment: 'i18n',
		title: 'Internationalization of datepickers',
		type: NgbdDatepickerI18n,
		code: 'datepicker/demos/i18n/datepicker-i18n.ts',
		markup: 'datepicker/demos/i18n/datepicker-i18n.html',
	},
	{
		fragment: 'customday',
		title: 'Custom day view',
		type: NgbdDatepickerCustomday,
		code: 'datepicker/demos/customday/datepicker-customday.ts',
		markup: 'datepicker/demos/customday/datepicker-customday.html',
	},
	{
		fragment: 'custommonth',
		title: 'Custom month layout',
		type: NgbdDatepickerCustommonth,
		code: 'datepicker/demos/custommonth/datepicker-custommonth.ts',
		markup: 'datepicker/demos/custommonth/datepicker-custommonth.html',
	},
	{
		fragment: 'footertemplate',
		title: 'Footer template',
		type: NgbdDatepickerFootertemplate,
		code: 'datepicker/demos/footertemplate/datepicker-footertemplate.ts',
		markup: 'datepicker/demos/footertemplate/datepicker-footertemplate.html',
	},
	{
		fragment: 'positiontarget',
		title: 'Position target',
		type: NgbdDatepickerPositiontarget,
		code: 'datepicker/demos/positiontarget/datepicker-positiontarget.ts',
		markup: 'datepicker/demos/positiontarget/datepicker-positiontarget.html',
	},
	{
		fragment: 'keyboard',
		title: 'Custom keyboard navigation',
		type: NgbdDatepickerKeyboard,
		code: 'datepicker/demos/keyboard/datepicker-keyboard.ts',
		markup: 'datepicker/demos/keyboard/datepicker-keyboard.html',
	},
	{
		fragment: 'config',
		title: 'Global configuration of datepickers',
		type: NgbdDatepickerConfig,
		code: 'datepicker/demos/config/datepicker-config.ts',
		markup: 'datepicker/demos/config/datepicker-config.html',
	},
];

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'overview' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
			name: 'Datepicker',
		},
		children: [
			{
				path: 'overview',
				component: NgbdDatepickerOverviewComponent,
				data: { overview: OVERVIEW },
			},
			{
				path: 'examples',
				component: DemoListComponent,
				data: { demos: DEMOS },
			},
			{
				path: 'calendars',
				component: NgbdDatepickerCalendarsComponent,
				data: { demos: CALENDAR_DEMOS },
			},
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
