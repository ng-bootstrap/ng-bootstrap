/* eslint-disable @typescript-eslint/no-var-requires */
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { DemoListComponent } from '../../shared/examples-page/demo-list.component';
import { NgbdCollapseBasic } from './demos/basic/collapse-basic';
import { NgbdCollapseHorizontal } from './demos/horizontal/collapse-horizontal';
import { NgbdCollapseNavbar } from './demos/navbar/collapse-navbar';
import { Routes } from '@angular/router';

const DEMOS = [
	{
		fragment: 'basic',
		title: 'Collapse',
		type: NgbdCollapseBasic,
		code: 'collapse/demos/basic/collapse-basic.ts',
		markup: 'collapse/demos/basic/collapse-basic.html',
	},
	{
		fragment: 'horizontal',
		title: 'Horizontal collapse',
		type: NgbdCollapseHorizontal,
		code: 'collapse/demos/horizontal/collapse-horizontal.ts',
		markup: 'collapse/demos/horizontal/collapse-horizontal.html',
	},
	{
		fragment: 'navbar',
		title: 'Responsive Navbar',
		type: NgbdCollapseNavbar,
		code: 'collapse/demos/navbar/collapse-navbar.ts',
		markup: 'collapse/demos/navbar/collapse-navbar.html',
	},
];

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'examples' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
			name: 'Collapse',
			bootstrap: 'https://getbootstrap.com/docs/%version%/components/collapse/',
		},
		children: [
			{ path: 'examples', component: DemoListComponent, data: { demos: DEMOS } },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
