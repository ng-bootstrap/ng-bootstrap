/* eslint-disable @typescript-eslint/no-var-requires */
import { NgModule } from '@angular/core';

import { NgbdSharedModule } from '../../shared';
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdComponentsSharedModule, NgbdDemoList } from '../shared';
import { NgbdApiPage } from '../shared/api-page/api.component';
import { NgbdExamplesPage } from '../shared/examples-page/examples.component';
import { NgbdOffcanvasBasicModule } from './demos/basic/offcanvas-basic.module';
import { NgbdOffcanvasBasic } from './demos/basic/offcanvas-basic';
import { NgbdOffcanvasComponentModule } from './demos/component/offcanvas-component.module';
import { NgbdOffcanvasComponent } from './demos/component/offcanvas-component';
import { NgbdOffcanvasOptionsModule } from './demos/options/offcanvas-options.module';
import { NgbdOffcanvasOptions } from './demos/options/offcanvas-options';
import { NgbdOffcanvasFocusModule } from './demos/focus/offcanvas-focus.module';
import { NgbdOffcanvasFocus } from './demos/focus/offcanvas-focus';
import { NgbdOffcanvasConfigModule } from './demos/config/offcanvas-config.module';
import { NgbdOffcanvasConfig } from './demos/config/offcanvas-config';

const DEMOS = {
  basic: {
    title: 'Basic offcanvas',
    type: NgbdOffcanvasBasic,
    code: require('!!raw-loader!./demos/basic/offcanvas-basic').default,
    markup: require('!!raw-loader!./demos/basic/offcanvas-basic.html').default
  },
  component: {
    title: 'Components as content',
    type: NgbdOffcanvasComponent,
    code: require('!!raw-loader!./demos/component/offcanvas-component').default,
    markup: require('!!raw-loader!./demos/component/offcanvas-component.html').default
  },
  options: {
    title: 'Offcanvas options',
    type: NgbdOffcanvasOptions,
    code: require('!!raw-loader!./demos/options/offcanvas-options').default,
    markup: require('!!raw-loader!./demos/options/offcanvas-options.html').default
  },
  focus: {
    title: 'Focus management',
    type: NgbdOffcanvasFocus,
    code: require('!!raw-loader!./demos/focus/offcanvas-focus').default,
    markup: require('!!raw-loader!./demos/focus/offcanvas-focus.html').default
  },
  config: {
    title: 'Global configuration of Offcanvas',
    type: NgbdOffcanvasConfig,
    code: require('!!raw-loader!./demos/config/offcanvas-config').default,
    markup: require('!!raw-loader!./demos/config/offcanvas-config.html').default
  }
};

export const ROUTES = [
  { path: '', pathMatch: 'full', redirectTo: 'examples' },
  {
    path: '',
    component: ComponentWrapper,
    data: {
      bootstrap: 'https://getbootstrap.com/docs/%version%/components/offcanvas/'
    },
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
    NgbdOffcanvasBasicModule,
    NgbdOffcanvasComponentModule,
    NgbdOffcanvasFocusModule,
    NgbdOffcanvasOptionsModule,
    NgbdOffcanvasConfigModule
  ]
})
export class NgbdOffcanvasModule {
  constructor(demoList: NgbdDemoList) {
    demoList.register('offcanvas', DEMOS);
  }
}
