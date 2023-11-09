/* eslint-disable @typescript-eslint/no-var-requires */
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdApiPage } from '../../shared/api-page/api-page.component';
import { DemoListComponent } from '../../shared/examples-page/demo-list.component';
import { NgbdPaginationAdvanced } from './demos/advanced/pagination-advanced';
import { NgbdPaginationBasic } from './demos/basic/pagination-basic';
import { NgbdPaginationConfig } from './demos/config/pagination-config';
import { NgbdPaginationCustomization } from './demos/customization/pagination-customization';
import { NgbdPaginationDisabled } from './demos/disabled/pagination-disabled';
import { NgbdPaginationJustify } from './demos/justify/pagination-justify';
import { NgbdPaginationSize } from './demos/size/pagination-size';
import { NgbdPaginationOverviewComponent } from './overview/pagination-overview.component';
import { Routes } from '@angular/router';

const OVERVIEW = {
	'basic-usage': 'Basic Usage',
	customization: 'Customization',
};

const DEMOS = [
	{
		fragment: 'basic',
		title: 'Basic pagination',
		type: NgbdPaginationBasic,
		code: 'pagination/demos/basic/pagination-basic.ts',
		markup: 'pagination/demos/basic/pagination-basic.html',
	},
	{
		fragment: 'advanced',
		title: 'Advanced pagination',
		type: NgbdPaginationAdvanced,
		code: 'pagination/demos/advanced/pagination-advanced.ts',
		markup: 'pagination/demos/advanced/pagination-advanced.html',
	},
	{
		fragment: 'customization',
		title: 'Custom links and pages',
		type: NgbdPaginationCustomization,
		code: 'pagination/demos/customization/pagination-customization.ts',
		markup: 'pagination/demos/customization/pagination-customization.html',
	},
	{
		fragment: 'size',
		title: 'Pagination size',
		type: NgbdPaginationSize,
		code: 'pagination/demos/size/pagination-size.ts',
		markup: 'pagination/demos/size/pagination-size.html',
	},
	{
		fragment: 'justify',
		title: 'Pagination alignment',
		type: NgbdPaginationJustify,
		code: 'pagination/demos/justify/pagination-justify.ts',
		markup: 'pagination/demos/justify/pagination-justify.html',
	},
	{
		fragment: 'disabled',
		title: 'Disabled pagination',
		type: NgbdPaginationDisabled,
		code: 'pagination/demos/disabled/pagination-disabled.ts',
		markup: 'pagination/demos/disabled/pagination-disabled.html',
	},
	{
		fragment: 'config',
		title: 'Global configuration',
		type: NgbdPaginationConfig,
		code: 'pagination/demos/config/pagination-config.ts',
		markup: 'pagination/demos/config/pagination-config.html',
	},
];

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'overview' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
			name: 'Pagination',
			bootstrap: 'https://getbootstrap.com/docs/%version%/components/pagination/',
		},
		children: [
			{
				path: 'overview',
				component: NgbdPaginationOverviewComponent,
				data: { overview: OVERVIEW },
			},
			{
				path: 'examples',
				component: DemoListComponent,
				data: { demos: DEMOS },
			},
			{ path: 'api', component: NgbdApiPage },
		],
	},
];
