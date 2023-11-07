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
		code: 'offcanvas/demos/basic/offcanvas-basic.ts',
		markup: 'offcanvas/demos/basic/offcanvas-basic.html',
	},
	component: {
		title: 'Components as content',
		type: NgbdOffcanvasComponent,
		code: 'offcanvas/demos/component/offcanvas-component.ts',
		markup: 'offcanvas/demos/component/offcanvas-component.html',
	},
	options: {
		title: 'Offcanvas options',
		type: NgbdOffcanvasOptions,
		code: 'offcanvas/demos/options/offcanvas-options.ts',
		markup: 'offcanvas/demos/options/offcanvas-options.html',
	},
	focus: {
		title: 'Focus management',
		type: NgbdOffcanvasFocus,
		code: 'offcanvas/demos/focus/offcanvas-focus.ts',
		markup: 'offcanvas/demos/focus/offcanvas-focus.html',
	},
	config: {
		title: 'Global configuration of Offcanvas',
		type: NgbdOffcanvasConfig,
		code: 'offcanvas/demos/config/offcanvas-config.ts',
		markup: 'offcanvas/demos/config/offcanvas-config.html',
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
