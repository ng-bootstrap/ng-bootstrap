/* eslint-disable @typescript-eslint/no-var-requires */
import { NgModule } from '@angular/core';

import { NgbdSharedModule } from '../../shared';
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdComponentsSharedModule, NgbdDemoList } from '../shared';
import { NgbdApiPage } from '../shared/api-page/api.component';
import { NgbdExamplesPage } from '../shared/examples-page/examples.component';
import { NgbdOffcanvasComponentModule } from './demos/component/offcanvas-component.module';
import { NgbdOffcanvasComponent } from './demos/component/offcanvas-component';

const DEMOS = {
  component: {
    title: 'Components as content',
    type: NgbdOffcanvasComponent,
    code: require('!!raw-loader!./demos/component/offcanvas-component').default,
    markup: require('!!raw-loader!./demos/component/offcanvas-component.html').default
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
    NgbdOffcanvasComponentModule
  ]
})
export class NgbdOffcanvasModule {
  constructor(demoList: NgbdDemoList) {
    demoList.register('offcanvas', DEMOS);
  }
}
