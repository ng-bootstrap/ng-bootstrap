import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { NgbdExamplesPageComponent } from '../../shared/examples-page/examples-page.component';
import { NgbdCollapseBasic } from './demos/basic/collapse-basic';
import { NgbdCollapseHorizontal } from './demos/horizontal/collapse-horizontal';
import { NgbdCollapseNavbar } from './demos/navbar/collapse-navbar';
import { Routes } from '@angular/router';
import { COMPONENT_DATA, ComponentData } from '../../tokens';

const DATA: ComponentData = {
	name: 'Collapse',
	bootstrapUrl: 'https://getbootstrap.com/docs/%version%/components/collapse/',
	overview: {},
	demos: [
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
	],
};

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'examples' },
	{
		path: '',
		component: ComponentWrapper,
		providers: [{ provide: COMPONENT_DATA, useValue: DATA }],
		children: [
			{ path: 'examples', component: NgbdExamplesPageComponent },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
