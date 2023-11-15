import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { DemoListComponent } from '../../shared/examples-page/demo-list.component';
import { NgbdModalBasic } from './demos/basic/modal-basic';
import { NgbdModalComponent } from './demos/component/modal-component';
import { NgbdModalConfig } from './demos/config/modal-config';
import { NgbdModalFocus } from './demos/focus/modal-focus';
import { NgbdModalOptions } from './demos/options/modal-options';
import { NgbdModalUpdatableOptions } from './demos/updatable/modal-updatable-options';
import { NgbdModalStacked } from './demos/stacked/modal-stacked';
import { Routes } from '@angular/router';

const DEMOS = [
	{
		fragment: 'basic',
		title: 'Modal with default options',
		type: NgbdModalBasic,
		code: 'modal/demos/basic/modal-basic.ts',
		markup: 'modal/demos/basic/modal-basic.html',
	},
	{
		fragment: 'component',
		title: 'Components as content',
		type: NgbdModalComponent,
		code: 'modal/demos/component/modal-component.ts',
		markup: 'modal/demos/component/modal-component.html',
	},
	{
		fragment: 'focus',
		title: 'Focus management',
		type: NgbdModalFocus,
		code: 'modal/demos/focus/modal-focus.ts',
		markup: 'modal/demos/focus/modal-focus.html',
	},
	{
		fragment: 'options',
		title: 'Modal with options',
		type: NgbdModalOptions,
		code: 'modal/demos/options/modal-options.ts',
		markup: 'modal/demos/options/modal-options.html',
	},
	{
		fragment: 'updatable',
		title: 'Updatable options',
		type: NgbdModalUpdatableOptions,
		code: 'modal/demos/updatable/modal-updatable-options.ts',
		markup: 'modal/demos/updatable/modal-updatable-options.html',
	},
	{
		fragment: 'stacked',
		title: 'Stacked modals',
		type: NgbdModalStacked,
		code: 'modal/demos/stacked/modal-stacked.ts',
		markup: 'modal/demos/stacked/modal-stacked.html',
	},
	{
		fragment: 'config',
		title: 'Global configuration of modals',
		type: NgbdModalConfig,
		code: 'modal/demos/config/modal-config.ts',
		markup: 'modal/demos/config/modal-config.html',
	},
];

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'examples' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
			name: 'Dropdown',
			bootstrap: 'https://getbootstrap.com/docs/%version%/components/modal/',
		},
		children: [
			{ path: 'examples', component: DemoListComponent, data: { demos: DEMOS } },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
