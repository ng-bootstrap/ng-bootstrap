import { NgModule } from '@angular/core';

import { NgbdSharedModule } from '../../shared';
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdComponentsSharedModule, NgbdDemoList } from '../shared';
import { NgbdApiPage } from '../shared/api-page/api.component';
import { NgbdExamplesPage } from '../shared/examples-page/examples.component';
import { NgbdCollapseBasic } from './demos/basic/collapse-basic';
import { NgbdCollapseBasicModule } from './demos/basic/collapse-basic.module';

const DEMOS = {
  basic: {
    title: 'Collapse',
    type: NgbdCollapseBasic,
    code: require('!!raw-loader!./demos/basic/collapse-basic').default,
    markup: require('!!raw-loader!./demos/basic/collapse-basic.html').default
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
    NgbdComponentsSharedModule,
    NgbdCollapseBasicModule
  ]
})
export class NgbdCollapseModule {
  constructor(demoList: NgbdDemoList) {
    demoList.register('collapse', DEMOS);
  }
}
