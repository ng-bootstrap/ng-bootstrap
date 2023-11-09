/* eslint-disable @typescript-eslint/no-var-requires */
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { DemoListComponent } from '../../shared/examples-page/demo-list.component';
import { NgbdDropdownBasic } from './demos/basic/dropdown-basic';
import { NgbdDropdownConfig } from './demos/config/dropdown-config';
import { NgbdDropdownContainer } from './demos/container/dropdown-container';
import { NgbdDropdownForm } from './demos/form/dropdown-form';
import { NgbdDropdownManual } from './demos/manual/dropdown-manual';
import { NgbdDropdownNavbar } from './demos/navbar/dropdown-navbar';
import { NgbdDropdownSplit } from './demos/split/dropdown-split';
import { NgbdDropdownDisabled } from './demos/disabled/dropdown-disabled';
import { Routes } from '@angular/router';

const DEMOS = [
	{
		fragment: 'basic',
		title: 'Dropdown',
		type: NgbdDropdownBasic,
		code: 'dropdown/demos/basic/dropdown-basic.ts',
		markup: 'dropdown/demos/basic/dropdown-basic.html',
	},
	{
		fragment: 'manual',
		title: 'Manual and custom triggers',
		type: NgbdDropdownManual,
		code: 'dropdown/demos/manual/dropdown-manual.ts',
		markup: 'dropdown/demos/manual/dropdown-manual.html',
	},
	{
		fragment: 'split',
		title: 'Button groups and split buttons',
		type: NgbdDropdownSplit,
		code: 'dropdown/demos/split/dropdown-split.ts',
		markup: 'dropdown/demos/split/dropdown-split.html',
	},
	{
		fragment: 'disabled',
		title: 'Disabled items',
		type: NgbdDropdownDisabled,
		code: 'dropdown/demos/disabled/dropdown-disabled.ts',
		markup: 'dropdown/demos/disabled/dropdown-disabled.html',
	},
	{
		fragment: 'form',
		title: 'Mixed menu items and form',
		type: NgbdDropdownForm,
		code: 'dropdown/demos/form/dropdown-form.ts',
		markup: 'dropdown/demos/form/dropdown-form.html',
	},
	{
		fragment: 'container',
		title: 'Container “body”',
		type: NgbdDropdownContainer,
		code: 'dropdown/demos/container/dropdown-container.ts',
		markup: 'dropdown/demos/container/dropdown-container.html',
	},
	{
		fragment: 'navbar',
		title: 'Dynamic positioning in a navbar',
		type: NgbdDropdownNavbar,
		code: 'dropdown/demos/navbar/dropdown-navbar.ts',
		markup: 'dropdown/demos/navbar/dropdown-navbar.html',
	},
	{
		fragment: 'config',
		title: 'Global configuration of dropdowns',
		type: NgbdDropdownConfig,
		code: 'dropdown/demos/config/dropdown-config.ts',
		markup: 'dropdown/demos/config/dropdown-config.html',
	},
];

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'examples' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
			name: 'Dropdown',
			bootstrap: 'https://getbootstrap.com/docs/%version%/components/dropdowns/',
		},
		children: [
			{ path: 'examples', component: DemoListComponent, data: { demos: DEMOS } },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
