/* eslint-disable @typescript-eslint/no-var-requires */
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { NgbdExamplesPage } from '../../shared/examples-page/examples.component';
import { NgbdOffcanvasBasic } from './demos/basic/offcanvas-basic';
import { NgbdOffcanvasComponent } from './demos/component/offcanvas-component';
import { NgbdOffcanvasOptions } from './demos/options/offcanvas-options';
import { NgbdOffcanvasFocus } from './demos/focus/offcanvas-focus';
import { NgbdOffcanvasConfig } from './demos/config/offcanvas-config';
import { Routes } from '@angular/router';
import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import { NgbdDemoListService } from '../../services/demo-list.service';

const DEMOS = {
	basic: {
		title: 'Basic offcanvas',
		type: NgbdOffcanvasBasic,
		code: require('!!raw-loader!./demos/basic/offcanvas-basic').default,
		markup: require('!!raw-loader!./demos/basic/offcanvas-basic.html').default,
	},
	component: {
		title: 'Components as content',
		type: NgbdOffcanvasComponent,
		code: require('!!raw-loader!./demos/component/offcanvas-component').default,
		markup: require('!!raw-loader!./demos/component/offcanvas-component.html').default,
	},
	options: {
		title: 'Offcanvas options',
		type: NgbdOffcanvasOptions,
		code: require('!!raw-loader!./demos/options/offcanvas-options').default,
		markup: require('!!raw-loader!./demos/options/offcanvas-options.html').default,
	},
	focus: {
		title: 'Focus management',
		type: NgbdOffcanvasFocus,
		code: require('!!raw-loader!./demos/focus/offcanvas-focus').default,
		markup: require('!!raw-loader!./demos/focus/offcanvas-focus.html').default,
	},
	config: {
		title: 'Global configuration of Offcanvas',
		type: NgbdOffcanvasConfig,
		code: require('!!raw-loader!./demos/config/offcanvas-config').default,
		markup: require('!!raw-loader!./demos/config/offcanvas-config.html').default,
	},
};

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'examples' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
			bootstrap: 'https://getbootstrap.com/docs/%version%/components/offcanvas/',
		},
		providers: [
			{
				provide: ENVIRONMENT_INITIALIZER,
				multi: true,
				useValue: () => inject(NgbdDemoListService).register('offcanvas', DEMOS),
			},
		],
		children: [
			{ path: 'examples', component: NgbdExamplesPage },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
