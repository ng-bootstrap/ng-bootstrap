/* eslint-disable @typescript-eslint/no-var-requires */
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { NgbdExamplesPage } from '../../shared/examples-page/examples.component';
import { NgbdModalBasic } from './demos/basic/modal-basic';
import { NgbdModalComponent } from './demos/component/modal-component';
import { NgbdModalConfig } from './demos/config/modal-config';
import { NgbdModalFocus } from './demos/focus/modal-focus';
import { NgbdModalOptions } from './demos/options/modal-options';
import { NgbdModalStacked } from './demos/stacked/modal-stacked';
import { Routes } from '@angular/router';
import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import { NgbdDemoListService } from '../../services/demo-list.service';

const DEMOS = {
	basic: {
		title: 'Modal with default options',
		type: NgbdModalBasic,
		code: require('!!raw-loader!./demos/basic/modal-basic').default,
		markup: require('!!raw-loader!./demos/basic/modal-basic.html').default,
	},
	component: {
		title: 'Components as content',
		type: NgbdModalComponent,
		code: require('!!raw-loader!./demos/component/modal-component').default,
		markup: require('!!raw-loader!./demos/component/modal-component.html').default,
	},
	focus: {
		title: 'Focus management',
		type: NgbdModalFocus,
		code: require('!!raw-loader!./demos/focus/modal-focus').default,
		markup: require('!!raw-loader!./demos/focus/modal-focus.html').default,
	},
	options: {
		title: 'Modal with options',
		type: NgbdModalOptions,
		code: require('!!raw-loader!./demos/options/modal-options').default,
		markup: require('!!raw-loader!./demos/options/modal-options.html').default,
	},
	stacked: {
		title: 'Stacked modals',
		type: NgbdModalStacked,
		code: require('!!raw-loader!./demos/stacked/modal-stacked').default,
		markup: require('!!raw-loader!./demos/stacked/modal-stacked.html').default,
	},
	config: {
		title: 'Global configuration of modals',
		type: NgbdModalConfig,
		code: require('!!raw-loader!./demos/config/modal-config').default,
		markup: require('!!raw-loader!./demos/config/modal-config.html').default,
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
