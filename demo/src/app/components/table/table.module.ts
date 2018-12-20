import { NgModule } from '@angular/core';

import { NgbdSharedModule } from '../../shared';
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdComponentsSharedModule, NgbdDemoList } from '../shared';
import { NgbdExamplesPage } from '../shared/examples-page/examples.component';
import { NgbdTableBasic } from './demos/basic/table-basic';
import { NgbdSortableHeader as NgbdSortableHeader1, NgbdTableSortable } from './demos/sortable/table-sortable';
import { NgbdTableFiltering } from './demos/filtering/table-filtering';
import { NgbdTablePagination } from './demos/pagination/table-pagination';
import { NgbdTableComplete } from './demos/complete/table-complete';
import { NgbdSortableHeader as NgbdSortableHeader2 } from './demos/complete/sortable.directive';
import { NgbdTableOverviewComponent } from './overview/table-overview.component';
import { NgbdTableOverviewDemo } from './overview/demo/table-overview-demo.component';

const DEMO_DIRECTIVES = [
  NgbdTableBasic, NgbdTableSortable, NgbdTableFiltering, NgbdTablePagination, NgbdTableComplete
];

const OVERVIEW = {
  'why-not': 'Why not?',
  'examples': 'Code examples'
};

const DEMOS = {
  basic: {
    title: 'Basic table',
    type: NgbdTableBasic,
    code: require('!!raw-loader!./demos/basic/table-basic'),
    markup: require('!!raw-loader!./demos/basic/table-basic.html')
  },
  sortable: {
    title: 'Sortable table',
    type: NgbdTableSortable,
    code: require('!!raw-loader!./demos/sortable/table-sortable'),
    markup: require('!!raw-loader!./demos/sortable/table-sortable.html')
  },
  filtering: {
    title: 'Search and filtering',
    type: NgbdTableFiltering,
    code: require('!!raw-loader!./demos/filtering/table-filtering'),
    markup: require('!!raw-loader!./demos/filtering/table-filtering.html')
  },
  pagination: {
    title: 'Pagination',
    type: NgbdTablePagination,
    code: require('!!raw-loader!./demos/pagination/table-pagination'),
    markup: require('!!raw-loader!./demos/pagination/table-pagination.html')
  },
  complete: {
    title: 'Complete example',
    type: NgbdTableComplete,
    code: require('!!raw-loader!./demos/complete/table-complete'),
    markup: require('!!raw-loader!./demos/complete/table-complete.html')
  }
};

export const ROUTES = [
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  {
    path: '',
    component: ComponentWrapper,
    data: { OVERVIEW },
    children: [
      { path: 'overview', component: NgbdTableOverviewComponent },
      { path: 'examples', component: NgbdExamplesPage }
    ]
  }
];

@NgModule({
  imports: [
    NgbdSharedModule,
    NgbdComponentsSharedModule
  ],
  declarations: [
    DEMO_DIRECTIVES,
    NgbdSortableHeader1,
    NgbdSortableHeader2,
    NgbdTableOverviewComponent,
    NgbdTableOverviewDemo
  ],
  entryComponents: DEMO_DIRECTIVES
})
export class NgbdTableModule {
  constructor(demoList: NgbdDemoList) {
    demoList.register('table', DEMOS, OVERVIEW);
  }
}
