import { NgModule } from '@angular/core';

import { NgbdSharedModule } from '../../shared';
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdComponentsSharedModule, NgbdDemoList } from '../shared';
import { NgbdApiPage } from '../shared/api-page/api.component';
import { NgbdExamplesPage } from '../shared/examples-page/examples.component';
import { NgbdDropdownBasic } from './demos/basic/dropdown-basic';
import { NgbdDropdownConfig } from './demos/config/dropdown-config';
import { NgbdDropdownManual } from './demos/manual/dropdown-manual';
import { NgbdDropdownSplit } from './demos/split/dropdown-split';

const DEMO_DIRECTIVES = [
  NgbdDropdownBasic,
  NgbdDropdownConfig,
  NgbdDropdownManual,
  NgbdDropdownSplit
];

const DEMOS = {
  basic: {
    title: 'Dropdown',
    type: NgbdDropdownBasic,
    code: require('!!raw-loader!./demos/basic/dropdown-basic'),
    markup: require('!!raw-loader!./demos/basic/dropdown-basic.html')
  },
  manual: {
    title: 'Manual and custom triggers',
    type: NgbdDropdownManual,
    code: require('!!raw-loader!./demos/manual/dropdown-manual'),
    markup: require('!!raw-loader!./demos/manual/dropdown-manual.html')
  },
  split: {
    title: 'Button groups and split buttons',
    type: NgbdDropdownSplit,
    code: require('!!raw-loader!./demos/split/dropdown-split'),
    markup: require('!!raw-loader!./demos/split/dropdown-split.html')
  },
  config: {
    title: 'Global configuration of dropdowns',
    type: NgbdDropdownConfig,
    code: require('!!raw-loader!./demos/config/dropdown-config'),
    markup: require('!!raw-loader!./demos/config/dropdown-config.html')
  }
};

export const ROUTES = [
  { path: '', pathMatch: 'full', redirectTo: 'examples' },
  {
    path: '',
    component: ComponentWrapper,
    children: [
      { path: 'examples', component: NgbdExamplesPage },
      { path: 'api', component: NgbdApiPage }
    ]
  }
];

@NgModule({
  imports: [
    NgbdSharedModule,
    NgbdComponentsSharedModule
  ],
  declarations: DEMO_DIRECTIVES,
  entryComponents: DEMO_DIRECTIVES
})
export class NgbdDropdownModule {
  constructor(demoList: NgbdDemoList) {
    demoList.register('dropdown', DEMOS);
  }
}
