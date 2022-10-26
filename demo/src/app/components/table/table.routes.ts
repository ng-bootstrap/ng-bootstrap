/* eslint-disable @typescript-eslint/no-var-requires */
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdExamplesPage } from '../../shared/examples-page/examples.component';
import { NgbdTableBasic } from './demos/basic/table-basic';
import { NgbdTableComplete } from './demos/complete/table-complete';
import { NgbdTableFiltering } from './demos/filtering/table-filtering';
import { NgbdTablePagination } from './demos/pagination/table-pagination';
import { NgbdTableSortable } from './demos/sortable/table-sortable';
import { NgbdTableOverviewComponent } from './overview/table-overview.component';
import { Routes } from '@angular/router';
import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import { NgbdDemoListService } from '../../services/demo-list.service';

const OVERVIEW = {
	'why-not': 'Why not?',
	examples: 'Code examples',
};

const DEMOS = {
	basic: {
		title: 'Basic table',
		type: NgbdTableBasic,
		files: [
			{
				name: 'table-basic.html',
				source: require('!!raw-loader!./demos/basic/table-basic.html').default,
			},
			{
				name: 'table-basic.ts',
				source: require('!!raw-loader!./demos/basic/table-basic').default,
			},
		],
	},
	sortable: {
		title: 'Sortable table',
		type: NgbdTableSortable,
		files: [
			{
				name: 'table-sortable.html',
				source: require('!!raw-loader!./demos/sortable/table-sortable.html').default,
			},
			{
				name: 'table-sortable.ts',
				source: require('!!raw-loader!./demos/sortable/table-sortable').default,
			},
		],
	},
	filtering: {
		title: 'Search and filtering',
		type: NgbdTableFiltering,
		files: [
			{
				name: 'table-filtering.html',
				source: require('!!raw-loader!./demos/filtering/table-filtering.html').default,
			},
			{
				name: 'table-filtering.ts',
				source: require('!!raw-loader!./demos/filtering/table-filtering').default,
			},
		],
	},
	pagination: {
		title: 'Pagination',
		type: NgbdTablePagination,
		files: [
			{
				name: 'table-pagination.html',
				source: require('!!raw-loader!./demos/pagination/table-pagination.html').default,
			},
			{
				name: 'table-pagination.ts',
				source: require('!!raw-loader!./demos/pagination/table-pagination').default,
			},
		],
	},
	complete: {
		title: 'Complete example',
		type: NgbdTableComplete,
		files: [
			{
				name: 'countries.ts',
				source: require('!!raw-loader!./demos/complete/countries').default,
			},
			{
				name: 'country.service.ts',
				source: require('!!raw-loader!./demos/complete/country.service').default,
			},
			{
				name: 'country.ts',
				source: require('!!raw-loader!./demos/complete/country').default,
			},
			{
				name: 'table-complete.html',
				source: require('!!raw-loader!./demos/complete/table-complete.html').default,
			},
			{
				name: 'table-complete.ts',
				source: require('!!raw-loader!./demos/complete/table-complete').default,
			},
			{
				name: 'sortable.directive.ts',
				source: require('!!raw-loader!./demos/complete/sortable.directive').default,
			},
		],
	},
};

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'overview' },
	{
		path: '',
		component: ComponentWrapper,
		providers: [
			{
				provide: ENVIRONMENT_INITIALIZER,
				multi: true,
				useValue: () => inject(NgbdDemoListService).register('table', DEMOS, OVERVIEW),
			},
		],
		children: [
			{ path: 'overview', component: NgbdTableOverviewComponent },
			{ path: 'examples', component: NgbdExamplesPage },
		],
	},
];
