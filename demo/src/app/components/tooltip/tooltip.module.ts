import { NgModule } from '@angular/core';

import { NgbdSharedModule } from '../../shared';
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdComponentsSharedModule, NgbdDemoList } from '../shared';
import { NgbdApiPage } from '../shared/api-page/api.component';
import { NgbdExamplesPage } from '../shared/examples-page/examples.component';
import { NgbdTooltipAutoclose } from './demos/autoclose/tooltip-autoclose';
import { NgbdTooltipBasic } from './demos/basic/tooltip-basic';
import { NgbdTooltipConfig } from './demos/config/tooltip-config';
import { NgbdTooltipContainer } from './demos/container/tooltip-container';
import { NgbdTooltipTplcontent } from './demos/tplcontent/tooltip-tplcontent';
import { NgbdTooltipTplwithcontext } from './demos/tplwithcontext/tooltip-tplwithcontext';
import { NgbdTooltipTriggers } from './demos/triggers/tooltip-triggers';

const DEMO_DIRECTIVES = [
  NgbdTooltipBasic,
  NgbdTooltipContainer,
  NgbdTooltipTplcontent,
  NgbdTooltipTriggers,
  NgbdTooltipAutoclose,
  NgbdTooltipConfig,
  NgbdTooltipTplwithcontext
];

const DEMOS = {
  basic: {
    title: 'Quick and easy tooltips',
    type: NgbdTooltipBasic,
    code: require('!!raw-loader!./demos/basic/tooltip-basic'),
    markup: require('!!raw-loader!./demos/basic/tooltip-basic.html')
  },
  tplcontent: {
    title: 'HTML and bindings in tooltips',
    type: NgbdTooltipTplcontent,
    code: require('!!raw-loader!./demos/tplcontent/tooltip-tplcontent'),
    markup: require('!!raw-loader!./demos/tplcontent/tooltip-tplcontent.html')
  },
  triggers: {
    title: 'Custom and manual triggers',
    type: NgbdTooltipTriggers,
    code: require('!!raw-loader!./demos/triggers/tooltip-triggers'),
    markup: require('!!raw-loader!./demos/triggers/tooltip-triggers.html')
  },
  autoclose: {
    title: 'Automatic closing with keyboard and mouse',
    type: NgbdTooltipAutoclose,
    code: require('!!raw-loader!./demos/autoclose/tooltip-autoclose'),
    markup: require('!!raw-loader!./demos/autoclose/tooltip-autoclose.html')
  },
  tplwithcontext: {
    title: 'Context and manual triggers',
    type: NgbdTooltipTplwithcontext,
    code: require('!!raw-loader!./demos/tplwithcontext/tooltip-tplwithcontext'),
    markup: require('!!raw-loader!./demos/tplwithcontext/tooltip-tplwithcontext.html')
  },
  container: {
    title: 'Append tooltip in the body',
    type: NgbdTooltipContainer,
    code: require('!!raw-loader!./demos/container/tooltip-container'),
    markup: require('!!raw-loader!./demos/container/tooltip-container.html')
  },
  config: {
    title: 'Global configuration of tooltips',
    type: NgbdTooltipConfig,
    code: require('!!raw-loader!./demos/config/tooltip-config'),
    markup: require('!!raw-loader!./demos/config/tooltip-config.html')
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
export class NgbdTooltipModule {
  constructor(demoList: NgbdDemoList) {
    demoList.register('tooltip', DEMOS);
  }
}
