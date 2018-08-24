import { NgModule } from '@angular/core';

import { NgbdSharedModule } from '../../shared';
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdComponentsSharedModule, NgbdDemoList } from '../shared';
import { NgbdApiPage } from '../shared/api-page/api.component';
import { NgbdExamplesPage } from '../shared/examples-page/examples.component';
import { NgbdProgressbarBasic } from './demos/basic/progressbar-basic';
import { NgbdProgressbarConfig } from './demos/config/progressbar-config';
import { NgbdProgressbarHeight } from './demos/height/progressbar-height';
import { NgbdProgressbarLabels } from './demos/labels/progressbar-labels';
import { NgbdProgressbarShowvalue } from './demos/showvalue/progressbar-showvalue';
import { NgbdProgressbarStriped } from './demos/striped/progressbar-striped';

const DEMO_DIRECTIVES = [
  NgbdProgressbarBasic,
  NgbdProgressbarShowvalue,
  NgbdProgressbarStriped,
  NgbdProgressbarConfig,
  NgbdProgressbarLabels,
  NgbdProgressbarHeight
];

const DEMOS = {
  basic: {
    title: 'Contextual progress bars',
    type: NgbdProgressbarBasic,
    code: require('!!raw-loader!./demos/basic/progressbar-basic'),
    markup: require('!!raw-loader!./demos/basic/progressbar-basic.html')
  },
  showvalue: {
    title: 'Progress bars with current value labels',
    type: NgbdProgressbarShowvalue,
    code: require('!!raw-loader!./demos/showvalue/progressbar-showvalue'),
    markup: require('!!raw-loader!./demos/showvalue/progressbar-showvalue.html')
  },
  striped: {
    title: 'Striped progress bars',
    type: NgbdProgressbarStriped,
    code: require('!!raw-loader!./demos/striped/progressbar-striped'),
    markup: require('!!raw-loader!./demos/striped/progressbar-striped.html')
  },
  labels: {
    title: 'Progress bars with custom labels',
    type: NgbdProgressbarLabels,
    code: require('!!raw-loader!./demos/labels/progressbar-labels'),
    markup: require('!!raw-loader!./demos/labels/progressbar-labels.html')
  },
  height: {
    title: 'Progress bars with height',
    type: NgbdProgressbarHeight,
    code: require('!!raw-loader!./demos/height/progressbar-height'),
    markup: require('!!raw-loader!./demos/height/progressbar-height.html')
  },
  config: {
    title: 'Global configuration of progress bars',
    type: NgbdProgressbarConfig,
    code: require('!!raw-loader!./demos/config/progressbar-config'),
    markup: require('!!raw-loader!./demos/config/progressbar-config.html')
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
export class NgbdProgressbarModule {
  constructor(demoList: NgbdDemoList) {
    demoList.register('progressbar', DEMOS);
  }
}
