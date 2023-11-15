import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { DemoListComponent } from '../../shared/examples-page/demo-list.component';
import { NgbdTableBasic } from './demos/basic/table-basic';
import { NgbdTableComplete } from './demos/complete/table-complete';
import { NgbdTableFiltering } from './demos/filtering/table-filtering';
import { NgbdTablePagination } from './demos/pagination/table-pagination';
import { NgbdTableSortable } from './demos/sortable/table-sortable';
import { NgbdTableOverviewComponent } from './overview/table-overview.component';
import { Routes } from '@angular/router';

const OVERVIEW = {
	'why-not': 'Why not?',
	examples: 'Code examples',
};

const DEMOS = [
	{
		fragment: 'basic',
		title: 'Basic table',
		type: NgbdTableBasic,
		files: [
			{
				name: 'table-basic.html',
				source: 'table/demos/basic/table-basic.html',
			},
			{
				name: 'table-basic.ts',
				source: 'table/demos/basic/table-basic.ts',
			},
		],
	},
	{
		fragment: 'sortable',
		title: 'Sortable table',
		type: NgbdTableSortable,
		files: [
			{
				name: 'table-sortable.html',
				source: 'table/demos/sortable/table-sortable.html',
			},
			{
				name: 'table-sortable.ts',
				source: 'table/demos/sortable/table-sortable.ts',
			},
		],
	},
	{
		fragment: 'filtering',
		title: 'Search and filtering',
		type: NgbdTableFiltering,
		files: [
			{
				name: 'table-filtering.html',
				source: 'table/demos/filtering/table-filtering.html',
			},
			{
				name: 'table-filtering.ts',
				source: 'table/demos/filtering/table-filtering.ts',
			},
		],
	},
	{
		fragment: 'pagination',
		title: 'Pagination',
		type: NgbdTablePagination,
		files: [
			{
				name: 'table-pagination.html',
				source: 'table/demos/pagination/table-pagination.html',
			},
			{
				name: 'table-pagination.ts',
				source: 'table/demos/pagination/table-pagination.ts',
			},
		],
	},
	{
		fragment: 'complete',
		title: 'Complete example',
		type: NgbdTableComplete,
		files: [
			{
				name: 'countries.ts',
				source: 'table/demos/complete/countries.ts',
			},
			{
				name: 'country.service.ts',
				source: 'table/demos/complete/country.service.ts',
			},
			{
				name: 'country.ts',
				source: 'table/demos/complete/country.ts',
			},
			{
				name: 'table-complete.html',
				source: 'table/demos/complete/table-complete.html',
			},
			{
				name: 'table-complete.ts',
				source: 'table/demos/complete/table-complete.ts',
			},
			{
				name: 'sortable.directive.ts',
				source: 'table/demos/complete/sortable.directive.ts',
			},
		],
	},
];

export const ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'overview' },
	{
		path: '',
		component: ComponentWrapper,
		data: {
			name: 'Table',
		},
		children: [
			{
				path: 'overview',
				component: NgbdTableOverviewComponent,
				data: { overview: OVERVIEW },
			},
			{
				path: 'examples',
				component: DemoListComponent,
				data: { demos: DEMOS },
			},
		],
	},
];
