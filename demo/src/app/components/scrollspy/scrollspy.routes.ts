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
		code: require('!!raw-loader!./demos/basic/scrollspy-basic').default,
		markup: require('!!raw-loader!./demos/basic/scrollspy-basic.html').default,
	},
	items: {
		title: 'Menu items',
		type: NgbdScrollSpyItems,
		code: require('!!raw-loader!./demos/items/scrollspy-items').default,
		markup: require('!!raw-loader!./demos/items/scrollspy-items.html').default,
	},
	service: {
		title: 'Service',
		type: NgbdScrollSpyService,
		code: require('!!raw-loader!./demos/service/scrollspy-service').default,
		markup: require('!!raw-loader!./demos/service/scrollspy-service.html').default,
	},
	nested: {
		title: 'Nested items',
		type: NgbdScrollSpyNested,
		code: require('!!raw-loader!./demos/nested/scrollspy-nested').default,
		markup: require('!!raw-loader!./demos/nested/scrollspy-nested.html').default,
	},
	navbar: {
		title: 'Navbar',
		type: NgbdScrollSpyNavbar,
		code: require('!!raw-loader!./demos/navbar/scrollspy-navbar').default,
		markup: require('!!raw-loader!./demos/navbar/scrollspy-navbar.html').default,
	},
};

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'overview' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
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
