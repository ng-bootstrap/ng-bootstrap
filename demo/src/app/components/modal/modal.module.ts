import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgbdSharedModule } from '../../shared';
import { ComponentWrapper } from '../../shared/component-wrapper/component.component';
import { NgbdComponentsSharedModule } from '../shared';
import { getApis, NgbdApiPage } from '../shared/api-page/api.component';
import { NgbdExamplesPage } from '../shared/examples-page/examples.component';
import { NgbdModalBasic } from './demos/basic/modal-basic';
import { NgbdModalComponent, NgbdModalContent } from './demos/component/modal-component';
import { NgbdModalOptions } from './demos/options/modal-options';

const DEMO_DIRECTIVES = [NgbdModalBasic, NgbdModalComponent, NgbdModalOptions];

const demos = {
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
  options: {
    title: 'Modal with options',
    type: NgbdModalOptions,
    code: require('!!raw-loader!./demos/options/modal-options'),
    markup: require('!!raw-loader!./demos/options/modal-options.html')
  }
};

const apis = getApis('modal');

const ROUTES = [
  { path: '', pathMatch: 'full', redirectTo: 'examples' },
  {
    path: '',
    component: ComponentWrapper,
    data: { demos, apis },
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
    RouterModule.forChild(ROUTES)
  ],
  exports: [RouterModule],
  declarations: [NgbdModalContent, ...DEMO_DIRECTIVES],
  entryComponents: DEMO_DIRECTIVES
})
export class NgbdModalModule {}
