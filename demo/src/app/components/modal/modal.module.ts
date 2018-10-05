import { NgModule } from '@angular/core';

import { NgbdSharedModule } from '../../shared';
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdComponentsSharedModule, NgbdDemoList } from '../shared';
import { NgbdApiPage } from '../shared/api-page/api.component';
import { NgbdExamplesPage } from '../shared/examples-page/examples.component';
import { NgbdModalBasic } from './demos/basic/modal-basic';
import { NgbdModalComponent, NgbdModalContent } from './demos/component/modal-component';
import { NgbdModalConfig } from './demos/config/modal-config';
import { NgbdModalConfirm, NgbdModalConfirmAutofocus, NgbdModalFocus } from './demos/focus/modal-focus';
import { NgbdModalOptions } from './demos/options/modal-options';
import { NgbdModal1Content, NgbdModal2Content, NgbdModalStacked } from './demos/stacked/modal-stacked';

const DEMO_DIRECTIVES = [
  NgbdModalBasic,
  NgbdModalComponent,
  NgbdModalOptions,
  NgbdModalStacked,
  NgbdModalConfig,
  NgbdModalFocus
];

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
  imports: [NgbdSharedModule, NgbdComponentsSharedModule],
  declarations: [
    NgbdModalContent,
    NgbdModal1Content,
    NgbdModal2Content,
    NgbdModalConfirm,
    NgbdModalConfirmAutofocus,
    ...DEMO_DIRECTIVES
  ],
  entryComponents: [
    NgbdModalContent,
    NgbdModal1Content,
    NgbdModal2Content,
    NgbdModalConfirm,
    NgbdModalConfirmAutofocus,
    ...DEMO_DIRECTIVES
  ]
})
export class NgbdModalModule {
  constructor(demoList: NgbdDemoList) {
    demoList.register('modal', DEMOS);
  }
}
