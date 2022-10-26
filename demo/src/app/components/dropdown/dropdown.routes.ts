/* eslint-disable @typescript-eslint/no-var-requires */
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { NgbdExamplesPage } from '../../shared/examples-page/examples.component';
import { NgbdDropdownBasic } from './demos/basic/dropdown-basic';
import { NgbdDropdownConfig } from './demos/config/dropdown-config';
import { NgbdDropdownContainer } from './demos/container/dropdown-container';
import { NgbdDropdownForm } from './demos/form/dropdown-form';
import { NgbdDropdownManual } from './demos/manual/dropdown-manual';
import { NgbdDropdownNavbar } from './demos/navbar/dropdown-navbar';
import { NgbdDropdownSplit } from './demos/split/dropdown-split';
import { NgbdDropdownDisabled } from './demos/disabled/dropdown-disabled';
import { Routes } from '@angular/router';
import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import { NgbdDemoListService } from '../../services/demo-list.service';

const DEMOS = {
	basic: {
		title: 'Dropdown',
		type: NgbdDropdownBasic,
		code: require('!!raw-loader!./demos/basic/dropdown-basic').default,
		markup: require('!!raw-loader!./demos/basic/dropdown-basic.html').default,
	},
	manual: {
		title: 'Manual and custom triggers',
		type: NgbdDropdownManual,
		code: require('!!raw-loader!./demos/manual/dropdown-manual').default,
		markup: require('!!raw-loader!./demos/manual/dropdown-manual.html').default,
	},
	split: {
		title: 'Button groups and split buttons',
		type: NgbdDropdownSplit,
		code: require('!!raw-loader!./demos/split/dropdown-split').default,
		markup: require('!!raw-loader!./demos/split/dropdown-split.html').default,
	},
	disabled: {
		title: 'Disabled items',
		type: NgbdDropdownDisabled,
		code: require('!!raw-loader!./demos/disabled/dropdown-disabled').default,
		markup: require('!!raw-loader!./demos/disabled/dropdown-disabled.html').default,
	},
	form: {
		title: 'Mixed menu items and form',
		type: NgbdDropdownForm,
		code: require('!!raw-loader!./demos/form/dropdown-form').default,
		markup: require('!!raw-loader!./demos/form/dropdown-form.html').default,
	},
	container: {
		title: 'Container “body”',
		type: NgbdDropdownContainer,
		code: require('!!raw-loader!./demos/container/dropdown-container').default,
		markup: require('!!raw-loader!./demos/container/dropdown-container.html').default,
	},
	navbar: {
		title: 'Dynamic positioning in a navbar',
		type: NgbdDropdownNavbar,
		code: require('!!raw-loader!./demos/navbar/dropdown-navbar').default,
		markup: require('!!raw-loader!./demos/navbar/dropdown-navbar.html').default,
	},
	config: {
		title: 'Global configuration of dropdowns',
		type: NgbdDropdownConfig,
		code: require('!!raw-loader!./demos/config/dropdown-config').default,
		markup: require('!!raw-loader!./demos/config/dropdown-config.html').default,
	},
};

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'examples' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
			bootstrap: 'https://getbootstrap.com/docs/%version%/components/dropdowns/',
		},
		providers: [
			{
				provide: ENVIRONMENT_INITIALIZER,
				multi: true,
				useValue: () => inject(NgbdDemoListService).register('dropdown', DEMOS),
			},
		],
		children: [
			{ path: 'examples', component: NgbdExamplesPage },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
