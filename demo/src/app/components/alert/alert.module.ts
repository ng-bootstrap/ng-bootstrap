import { NgModule } from '@angular/core';

import { NgbdSharedModule } from '../../shared';
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdComponentsSharedModule, NgbdDemoList } from '../shared';
import { NgbdApiPage } from '../shared/api-page/api.component';
import { NgbdExamplesPage } from '../shared/examples-page/examples.component';
import { NgbdAlertBasic } from './demos/basic/alert-basic';
import { NgbdAlertCloseable } from './demos/closeable/alert-closeable';
import { NgbdAlertConfig } from './demos/config/alert-config';
import { NgbdAlertCustom } from './demos/custom/alert-custom';
import { NgbdAlertSelfclosing } from './demos/selfclosing/alert-selfclosing';

const DEMO_DIRECTIVES = [NgbdAlertBasic, NgbdAlertCloseable, NgbdAlertSelfclosing, NgbdAlertCustom, NgbdAlertConfig];

const DEMOS = {
  basic: {
    title: 'Basic Alert',
    type: NgbdAlertBasic,
    code: require('!!raw-loader!./demos/basic/alert-basic'),
    markup: require('!!raw-loader!./demos/basic/alert-basic.html')
  },
  closeable: {
    title: 'Closable Alert',
    type: NgbdAlertCloseable,
    code: require('!!raw-loader!./demos/closeable/alert-closeable'),
    markup: require('!!raw-loader!./demos/closeable/alert-closeable.html')
  },
  selfclosing: {
    title: 'Self closing alert',
    type: NgbdAlertSelfclosing,
    code: require('!!raw-loader!./demos/selfclosing/alert-selfclosing'),
    markup: require('!!raw-loader!./demos/selfclosing/alert-selfclosing.html')
  },
  custom: {
    title: 'Custom alert',
    type: NgbdAlertCustom,
    code: require('!!raw-loader!./demos/custom/alert-custom'),
    markup: require('!!raw-loader!./demos/custom/alert-custom.html')
  },
  config: {
    title: 'Global configuration of alerts',
    type: NgbdAlertConfig,
    code: require('!!raw-loader!./demos/config/alert-config'),
    markup: require('!!raw-loader!./demos/config/alert-config.html')
  }
};

export const ROUTES = [
  { path: '', pathMatch: 'full', redirectTo: 'examples' },
  { path: '',
    component: ComponentWrapper,
    children: [
      { path: 'examples', component: NgbdExamplesPage },
      { path: 'api', component: NgbdApiPage }
    ]
  }
];

@NgModule({
  imports: [NgbdSharedModule, NgbdComponentsSharedModule ],
  declarations: DEMO_DIRECTIVES,
  entryComponents: DEMO_DIRECTIVES
})
export class NgbdAlertModule {
  constructor(demoList: NgbdDemoList) {
    demoList.register('alert', DEMOS);
  }
}
