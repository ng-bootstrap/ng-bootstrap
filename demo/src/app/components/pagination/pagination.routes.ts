/* eslint-disable @typescript-eslint/no-var-requires */
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { NgbdExamplesPage } from '../../shared/examples-page/examples.component';
import { NgbdPaginationAdvanced } from './demos/advanced/pagination-advanced';
import { NgbdPaginationBasic } from './demos/basic/pagination-basic';
import { NgbdPaginationConfig } from './demos/config/pagination-config';
import { NgbdPaginationCustomization } from './demos/customization/pagination-customization';
import { NgbdPaginationDisabled } from './demos/disabled/pagination-disabled';
import { NgbdPaginationJustify } from './demos/justify/pagination-justify';
import { NgbdPaginationSize } from './demos/size/pagination-size';
import { NgbdPaginationOverviewComponent } from './overview/pagination-overview.component';
import { Routes } from '@angular/router';
import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import { NgbdDemoListService } from '../../services/demo-list.service';

const OVERVIEW = {
	'basic-usage': 'Basic Usage',
	customization: 'Customization',
};

const DEMOS = {
	basic: {
		title: 'Basic pagination',
		type: NgbdPaginationBasic,
		code: require('!!raw-loader!./demos/basic/pagination-basic').default,
		markup: require('!!raw-loader!./demos/basic/pagination-basic.html').default,
	},
	advanced: {
		title: 'Advanced pagination',
		type: NgbdPaginationAdvanced,
		code: require('!!raw-loader!./demos/advanced/pagination-advanced').default,
		markup: require('!!raw-loader!./demos/advanced/pagination-advanced.html').default,
	},
	customization: {
		title: 'Custom links and pages',
		type: NgbdPaginationCustomization,
		code: require('!!raw-loader!./demos/customization/pagination-customization').default,
		markup: require('!!raw-loader!./demos/customization/pagination-customization.html').default,
	},
	size: {
		title: 'Pagination size',
		type: NgbdPaginationSize,
		code: require('!!raw-loader!./demos/size/pagination-size').default,
		markup: require('!!raw-loader!./demos/size/pagination-size.html').default,
	},
	justify: {
		title: 'Pagination alignment',
		type: NgbdPaginationJustify,
		code: require('!!raw-loader!./demos/justify/pagination-justify').default,
		markup: require('!!raw-loader!./demos/justify/pagination-justify.html').default,
	},
	disabled: {
		title: 'Disabled pagination',
		type: NgbdPaginationDisabled,
		code: require('!!raw-loader!./demos/disabled/pagination-disabled').default,
		markup: require('!!raw-loader!./demos/disabled/pagination-disabled.html').default,
	},
	config: {
		title: 'Global configuration',
		type: NgbdPaginationConfig,
		code: require('!!raw-loader!./demos/config/pagination-config').default,
		markup: require('!!raw-loader!./demos/config/pagination-config.html').default,
	},
};

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'overview' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
			bootstrap: 'https://getbootstrap.com/docs/%version%/components/pagination/',
		},
		providers: [
			{
				provide: ENVIRONMENT_INITIALIZER,
				multi: true,
				useValue: () => inject(NgbdDemoListService).register('pagination', DEMOS, OVERVIEW),
			},
		],
		children: [
			{ path: 'overview', component: NgbdPaginationOverviewComponent },
			{ path: 'examples', component: NgbdExamplesPage },
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
