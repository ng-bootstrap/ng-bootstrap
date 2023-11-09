/* eslint-disable @typescript-eslint/no-var-requires */
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { NgbdExamplesPage } from '../../shared/examples-page/examples.component';
import { NgbdScrollSpyOverviewComponent } from './overview/scrollspy-overview.component';
import { Routes } from '@angular/router';
import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import { NgbdDemoListService } from '../../services/demo-list.service';
import { NgbdScrollSpyBasic } from './demos/basic/scrollspy-basic';
import { NgbdScrollSpyNavbar } from './demos/navbar/scrollspy-navbar';
import { NgbdScrollSpyItems } from './demos/items/scrollspy-items';
import { NgbdScrollSpyNested } from './demos/nested/scrollspy-nested';
import { NgbdScrollSpyService } from './demos/service/scrollspy-service';

const OVERVIEW = {
	service: 'Basic service',
	directive: 'Scrollspy directive',
	highlighting: 'Highlighting active items',
	customization: 'Customization',
};

const DEMOS = {
	basic: {
		title: 'Basic',
		type: NgbdScrollSpyBasic,
		code: 'scrollspy/demos/basic/scrollspy-basic.ts',
		markup: 'scrollspy/demos/basic/scrollspy-basic.html',
	},
	items: {
		title: 'Menu items',
		type: NgbdScrollSpyItems,
		code: 'scrollspy/demos/items/scrollspy-items.ts',
		markup: 'scrollspy/demos/items/scrollspy-items.html',
	},
	service: {
		title: 'Service',
		type: NgbdScrollSpyService,
		code: 'scrollspy/demos/service/scrollspy-service.ts',
		markup: 'scrollspy/demos/service/scrollspy-service.html',
	},
	nested: {
		title: 'Nested items',
		type: NgbdScrollSpyNested,
		code: 'scrollspy/demos/nested/scrollspy-nested.ts',
		markup: 'scrollspy/demos/nested/scrollspy-nested.html',
	},
	navbar: {
		title: 'Navbar',
		type: NgbdScrollSpyNavbar,
		code: 'scrollspy/demos/navbar/scrollspy-navbar.ts',
		markup: 'scrollspy/demos/navbar/scrollspy-navbar.html',
	},
};

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'overview' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
			name: 'Scrollspy',
			bootstrap: 'https://getbootstrap.com/docs/%version%/components/scrollspy/',
		},
		providers: [
			{
				provide: ENVIRONMENT_INITIALIZER,
				multi: true,
				useValue: () => inject(NgbdDemoListService).register('scrollspy', DEMOS, OVERVIEW),
			},
		],
		children: [
			{ path: 'overview', component: NgbdScrollSpyOverviewComponent },
			{ path: 'examples', component: NgbdExamplesPage },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
