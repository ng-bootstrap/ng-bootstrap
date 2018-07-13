import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgbdSharedModule } from '../../shared';
import { ComponentWrapper } from '../../shared/component-wrapper/component.component';
import { NgbdComponentsSharedModule } from '../shared';
import { getApis, NgbdApiPage } from '../shared/api-page/api.component';
import { NgbdExamplesPage } from '../shared/examples-page/examples.component';
import { NgbdCollapseBasic } from './demos/basic/collapse-basic';

const DEMO_DIRECTIVES = [NgbdCollapseBasic];

const demos = {
  basic: {
    title: 'Collapse',
    type: NgbdCollapseBasic,
    code: require('!!raw-loader!./demos/basic/collapse-basic'),
    markup: require('!!raw-loader!./demos/basic/collapse-basic.html')
  }
};

const apis = getApis('collapse');

const ROUTES = [
  { path: '', pathMatch: 'full', redirectTo: 'examples' },
  { path: '',
    component: ComponentWrapper,
    data: { demos, apis },
    children: [
      { path: 'examples', component: NgbdExamplesPage },
      { path: 'api', component: NgbdApiPage }
    ]
  }
]

@NgModule({
  imports: [NgbdSharedModule, NgbdComponentsSharedModule, RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
  declarations: DEMO_DIRECTIVES,
  entryComponents: DEMO_DIRECTIVES
})
export class NgbdCollapseModule {}
