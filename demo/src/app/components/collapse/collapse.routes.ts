/* eslint-disable @typescript-eslint/no-var-requires */
import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdDemoListService } from '../../services/demo-list.service';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { NgbdExamplesPage } from '../../shared/examples-page/examples.component';
import { NgbdCollapseBasic } from './demos/basic/collapse-basic';
import { NgbdCollapseHorizontal } from './demos/horizontal/collapse-horizontal';
import { NgbdCollapseNavbar } from './demos/navbar/collapse-navbar';
import { Routes } from '@angular/router';

const DEMOS = {
	basic: {
		title: 'Collapse',
		type: NgbdCollapseBasic,
		code: 'collapse/demos/basic/collapse-basic.ts',
		markup: 'collapse/demos/basic/collapse-basic.html',
	},
	horizontal: {
		title: 'Horizontal collapse',
		type: NgbdCollapseHorizontal,
		code: 'collapse/demos/horizontal/collapse-horizontal.ts',
		markup: 'collapse/demos/horizontal/collapse-horizontal.html',
	},
	navbar: {
		title: 'Responsive Navbar',
		type: NgbdCollapseNavbar,
		code: 'collapse/demos/navbar/collapse-navbar.ts',
		markup: 'collapse/demos/navbar/collapse-navbar.html',
	},
};

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'examples' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
			name: 'Collapse',
			bootstrap: 'https://getbootstrap.com/docs/%version%/components/collapse/',
		},
		providers: [
			{
				provide: ENVIRONMENT_INITIALIZER,
				multi: true,
				useValue: () => inject(NgbdDemoListService).register('collapse', DEMOS),
			},
		],
		children: [
			{ path: 'examples', component: NgbdExamplesPage },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
