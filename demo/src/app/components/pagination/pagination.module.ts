import {NgModule} from '@angular/core';

import {NgbdSharedModule} from '../../shared';
import {ComponentWrapper} from '../../shared/component-wrapper/component-wrapper.component';
import {NgbdComponentsSharedModule, NgbdDemoList} from '../shared';
import {NgbdApiPage} from '../shared/api-page/api.component';
import {NgbdExamplesPage} from '../shared/examples-page/examples.component';
import {NgbdPaginationAdvanced} from './demos/advanced/pagination-advanced';
import {NgbdPaginationBasic} from './demos/basic/pagination-basic';
import {NgbdPaginationConfig} from './demos/config/pagination-config';
import {NgbdPaginationDisabled} from './demos/disabled/pagination-disabled';
import {NgbdPaginationJustify} from './demos/justify/pagination-justify';
import {NgbdPaginationSize} from './demos/size/pagination-size';
import {NgbdPaginationOverviewComponent} from './overview/pagination-overview.component';

const DEMO_DIRECTIVES = [
  NgbdPaginationAdvanced,
  NgbdPaginationBasic,
  NgbdPaginationSize,
  NgbdPaginationConfig,
  NgbdPaginationDisabled,
  NgbdPaginationJustify,
];

const OVERVIEW = {
  'basic-usage': 'Basic Usage',
};

const DEMOS = {
  basic: {
    title: 'Basic pagination',
    type: NgbdPaginationBasic,
    code: require('!!raw-loader!./demos/basic/pagination-basic'),
    markup: require('!!raw-loader!./demos/basic/pagination-basic.html')
  },
  advanced: {
    title: 'Advanced pagination',
    type: NgbdPaginationAdvanced,
    code: require('!!raw-loader!./demos/advanced/pagination-advanced'),
    markup: require('!!raw-loader!./demos/advanced/pagination-advanced.html')
  },
  size: {
    title: 'Pagination size',
    type: NgbdPaginationSize,
    code: require('!!raw-loader!./demos/size/pagination-size'),
    markup: require('!!raw-loader!./demos/size/pagination-size.html')
  },
  justify: {
    title: 'Pagination alignment',
    type: NgbdPaginationJustify,
    code: require('!!raw-loader!./demos/justify/pagination-justify'),
    markup: require('!!raw-loader!./demos/justify/pagination-justify.html')
  },
  disabled: {
    title: 'Disabled pagination',
    type: NgbdPaginationDisabled,
    code: require('!!raw-loader!./demos/disabled/pagination-disabled'),
    markup: require('!!raw-loader!./demos/disabled/pagination-disabled.html')
  },
  config: {
    title: 'Global configuration',
    type: NgbdPaginationConfig,
    code: require('!!raw-loader!./demos/config/pagination-config'),
    markup: require('!!raw-loader!./demos/config/pagination-config.html')
  }
};

export const ROUTES = [
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  {
    path: '',
    component: ComponentWrapper,
    data: { OVERVIEW },
    children: [
      { path: 'overview', component: NgbdPaginationOverviewComponent },
      { path: 'examples', component: NgbdExamplesPage },
      { path: 'api', component: NgbdApiPage }
    ]
  }
];

@NgModule({
  imports: [NgbdSharedModule, NgbdComponentsSharedModule],
  declarations: [...DEMO_DIRECTIVES, NgbdPaginationOverviewComponent],
  entryComponents: DEMO_DIRECTIVES
})
export class NgbdPaginationModule {
  constructor(demoList: NgbdDemoList) {
    demoList.register('pagination', DEMOS, OVERVIEW);
  }
}
