import { NgModule } from '@angular/core';

import { NgbdSharedModule } from '../../shared';
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdComponentsSharedModule, NgbdDemoList } from '../shared';
import { NgbdApiPage } from '../shared/api-page/api.component';
import { NgbdExamplesPage } from '../shared/examples-page/examples.component';
import { NgbdPopoverAutoclose } from './demos/autoclose/popover-autoclose';
import { NgbdPopoverAutocloseModule } from './demos/autoclose/popover-autoclose.module';
import { NgbdPopoverBasic } from './demos/basic/popover-basic';
import { NgbdPopoverBasicModule } from './demos/basic/popover-basic.module';
import { NgbdPopoverConfig } from './demos/config/popover-config';
import { NgbdPopoverConfigModule } from './demos/config/popover-config.module';
import { NgbdPopoverContainer } from './demos/container/popover-container';
import { NgbdPopoverContainerModule } from './demos/container/popover-container.module';
import { NgbdPopoverCustomClassModule } from './demos/customclass/popover-custom-class.module';
import { NgbdPopoverCustomclass } from './demos/customclass/popover-customclass';
import { NgbdPopoverDelay } from './demos/delay/popover-delay';
import { NgbdPopoverDelayModule } from './demos/delay/popover-delay.module';
import { NgbdPopoverTplContentModule } from './demos/tplcontent/popover-tpl-content.module';
import { NgbdPopoverTplcontent } from './demos/tplcontent/popover-tplcontent';
import { NgbdPopoverTplWithContextModule } from './demos/tplwithcontext/popover-tpl-with-context.module';
import { NgbdPopoverTplwithcontext } from './demos/tplwithcontext/popover-tplwithcontext';
import { NgbdPopoverTriggers } from './demos/triggers/popover-triggers';
import { NgbdPopoverTriggersModule } from './demos/triggers/popover-triggers.module';
import { NgbdPopoverVisibility } from './demos/visibility/popover-visibility';
import { NgbdPopoverVisibilityModule } from './demos/visibility/popover-visibility.module';

const DEMOS = {
  basic: {
    title: 'Quick and easy popovers',
    type: NgbdPopoverBasic,
    code: require('!!raw-loader!./demos/basic/popover-basic'),
    markup: require('!!raw-loader!./demos/basic/popover-basic.html')
  },
  tplcontent: {
    title: 'HTML and bindings in popovers',
    type: NgbdPopoverTplcontent,
    code: require('!!raw-loader!./demos/tplcontent/popover-tplcontent'),
    markup: require('!!raw-loader!./demos/tplcontent/popover-tplcontent.html')
  },
  triggers: {
    title: 'Custom and manual triggers',
    type: NgbdPopoverTriggers,
    code: require('!!raw-loader!./demos/triggers/popover-triggers'),
    markup: require('!!raw-loader!./demos/triggers/popover-triggers.html')
  },
  autoclose: {
    title: 'Automatic closing with keyboard and mouse',
    type: NgbdPopoverAutoclose,
    code: require('!!raw-loader!./demos/autoclose/popover-autoclose'),
    markup: require('!!raw-loader!./demos/autoclose/popover-autoclose.html')
  },
  tplwithcontext: {
    title: 'Context and manual triggers',
    type: NgbdPopoverTplwithcontext,
    code: require('!!raw-loader!./demos/tplwithcontext/popover-tplwithcontext'),
    markup: require('!!raw-loader!./demos/tplwithcontext/popover-tplwithcontext.html')
  },
  delay: {
    title: 'Open and close delays',
    type: NgbdPopoverDelay,
    code: require('!!raw-loader!./demos/delay/popover-delay'),
    markup: require('!!raw-loader!./demos/delay/popover-delay.html')
  },
  visibility: {
    title: 'Popover visibility events',
    type: NgbdPopoverVisibility,
    code: require('!!raw-loader!./demos/visibility/popover-visibility'),
    markup: require('!!raw-loader!./demos/visibility/popover-visibility.html')
  },
  container: {
    title: 'Append popover in the body',
    type: NgbdPopoverContainer,
    code: require('!!raw-loader!./demos/container/popover-container'),
    markup: require('!!raw-loader!./demos/container/popover-container.html')
  },
  customclass: {
    title: 'Popover with custom class',
    type: NgbdPopoverCustomclass,
    code: require('!!raw-loader!./demos/customclass/popover-customclass'),
    markup: require('!!raw-loader!./demos/customclass/popover-customclass.html')
  },
  config: {
    title: 'Global configuration of popovers',
    type: NgbdPopoverConfig,
    code: require('!!raw-loader!./demos/config/popover-config'),
    markup: require('!!raw-loader!./demos/config/popover-config.html')
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
    NgbdPopoverBasicModule,
    NgbdPopoverTplContentModule,
    NgbdPopoverTplWithContextModule,
    NgbdPopoverTriggersModule,
    NgbdPopoverAutocloseModule,
    NgbdPopoverVisibilityModule,
    NgbdPopoverContainerModule,
    NgbdPopoverCustomClassModule,
    NgbdPopoverDelayModule,
    NgbdPopoverConfigModule
  ]
})
export class NgbdPopoverModule {
  constructor(demoList: NgbdDemoList) {
    demoList.register('popover', DEMOS);
  }
}
