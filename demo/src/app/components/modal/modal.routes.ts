/* eslint-disable @typescript-eslint/no-var-requires */
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { NgbdExamplesPage } from '../../shared/examples-page/examples.component';
import { NgbdModalBasic } from './demos/basic/modal-basic';
import { NgbdModalComponent } from './demos/component/modal-component';
import { NgbdModalConfig } from './demos/config/modal-config';
import { NgbdModalFocus } from './demos/focus/modal-focus';
import { NgbdModalOptions } from './demos/options/modal-options';
import { NgbdModalUpdatableOptions } from './demos/updatable/modal-updatable-options';
import { NgbdModalStacked } from './demos/stacked/modal-stacked';
import { Routes } from '@angular/router';
import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import { NgbdDemoListService } from '../../services/demo-list.service';

const DEMOS = {
	basic: {
		title: 'Modal with default options',
		type: NgbdModalBasic,
		code: 'modal/demos/basic/modal-basic.ts',
		markup: 'modal/demos/basic/modal-basic.html',
	},
	component: {
		title: 'Components as content',
		type: NgbdModalComponent,
		code: 'modal/demos/component/modal-component.ts',
		markup: 'modal/demos/component/modal-component.html',
	},
	focus: {
		title: 'Focus management',
		type: NgbdModalFocus,
		code: 'modal/demos/focus/modal-focus.ts',
		markup: 'modal/demos/focus/modal-focus.html',
	},
	options: {
		title: 'Modal with options',
		type: NgbdModalOptions,
		code: 'modal/demos/options/modal-options.ts',
		markup: 'modal/demos/options/modal-options.html',
	},
	updatable: {
		title: 'Updatable options',
		type: NgbdModalUpdatableOptions,
		code: 'modal/demos/updatable/modal-updatable-options.ts',
		markup: 'modal/demos/updatable/modal-updatable-options.html',
	},
	stacked: {
		title: 'Stacked modals',
		type: NgbdModalStacked,
		code: 'modal/demos/stacked/modal-stacked.ts',
		markup: 'modal/demos/stacked/modal-stacked.html',
	},
	config: {
		title: 'Global configuration of modals',
		type: NgbdModalConfig,
		code: 'modal/demos/config/modal-config.ts',
		markup: 'modal/demos/config/modal-config.html',
	},
};

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'examples' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
			bootstrap: 'https://getbootstrap.com/docs/%version%/components/modal/',
		},
		providers: [
			{
				provide: ENVIRONMENT_INITIALIZER,
				multi: true,
				useValue: () => inject(NgbdDemoListService).register('modal', DEMOS),
			},
		],
		children: [
			{ path: 'examples', component: NgbdExamplesPage },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
