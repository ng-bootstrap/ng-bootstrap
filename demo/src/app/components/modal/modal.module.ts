import { NgModule } from '@angular/core';

import { NgbdSharedModule } from '../../shared';
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdComponentsSharedModule, NgbdDemoList } from '../shared';
import { NgbdApiPage } from '../shared/api-page/api.component';
import { NgbdExamplesPage } from '../shared/examples-page/examples.component';
import { NgbdModalBasic } from './demos/basic/modal-basic';
import { NgbdModalBasicModule } from './demos/basic/modal-basic.module';
import { NgbdModalComponent } from './demos/component/modal-component';
import { NgbdModalComponentModule } from './demos/component/modal-component.module';
import { NgbdModalConfig } from './demos/config/modal-config';
import { NgbdModalConfigModule } from './demos/config/modal-config.module';
import { NgbdModalFocus } from './demos/focus/modal-focus';
import { NgbdModalFocusModule } from './demos/focus/modal-focus.module';
import { NgbdModalOptions } from './demos/options/modal-options';
import { NgbdModalOptionsModule } from './demos/options/modal-options.module';
import { NgbdModalStacked } from './demos/stacked/modal-stacked';
import { NgbdModalStackedModule } from './demos/stacked/modal-stacked.module';

const DEMOS = {
  basic: {
    title: 'Modal with default options',
    type: NgbdModalBasic,
    code: require('!!raw-loader!./demos/basic/modal-basic'),
    markup: require('!!raw-loader!./demos/basic/modal-basic.html')
  },
  component: {
    title: 'Components as content',
    type: NgbdModalComponent,
    code: require('!!raw-loader!./demos/component/modal-component'),
    markup: require('!!raw-loader!./demos/component/modal-component.html')
  },
  focus: {
    title: 'Focus management',
    type: NgbdModalFocus,
    code: require('!!raw-loader!./demos/focus/modal-focus'),
    markup: require('!!raw-loader!./demos/focus/modal-focus.html')
  },
  options: {
    title: 'Modal with options',
    type: NgbdModalOptions,
    code: require('!!raw-loader!./demos/options/modal-options'),
    markup: require('!!raw-loader!./demos/options/modal-options.html')
  },
  stacked: {
    title: 'Stacked modals',
    type: NgbdModalStacked,
    code: require('!!raw-loader!./demos/stacked/modal-stacked'),
    markup: require('!!raw-loader!./demos/stacked/modal-stacked.html')
  },
  config: {
    title: 'Global configuration of modals',
    type: NgbdModalConfig,
    code: require('!!raw-loader!./demos/config/modal-config'),
    markup: require('!!raw-loader!./demos/config/modal-config.html')
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
    NgbdModalBasicModule,
    NgbdModalComponentModule,
    NgbdModalOptionsModule,
    NgbdModalStackedModule,
    NgbdModalConfigModule,
    NgbdModalFocusModule
  ]
})
export class NgbdModalModule {
  constructor(demoList: NgbdDemoList) {
    demoList.register('modal', DEMOS);
  }
}
