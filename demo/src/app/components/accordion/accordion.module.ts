import { NgModule } from '@angular/core';

import { NgbdSharedModule } from '../../shared';
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdComponentsSharedModule, NgbdDemoList } from '../shared';
import { NgbdApiPage } from '../shared/api-page/api.component';
import { NgbdExamplesPage } from '../shared/examples-page/examples.component';
import { NgbdAccordionBasic } from './demos/basic/accordion-basic';
import { NgbdAccordionBasicModule } from './demos/basic/accordion-basic.module';
import { NgbdAccordionConfig } from './demos/config/accordion-config';
import { NgbdAccordionConfigModule } from './demos/config/accordion-config.module';
import { NgbdAccordionHeader } from './demos/header/accordion-header';
import { NgbdAccordionHeaderModule } from './demos/header/accordion-header.module';
import { NgbdAccordionPreventchange } from './demos/preventchange/accordion-preventchange';
import { NgbdAccordionPreventchangeModule } from './demos/preventchange/accordion-preventchange.module';
import { NgbdAccordionStatic } from './demos/static/accordion-static';
import { NgbdAccordionStaticModule } from './demos/static/accordion-static.module';
import { NgbdAccordionToggle } from './demos/toggle/accordion-toggle';
import { NgbdAccordionToggleModule } from './demos/toggle/accordion-toggle.module';

const DEMOS = {
  basic: {
    title: 'Accordion',
    code: require('!raw-loader!./demos/basic/accordion-basic'),
    markup: require('!raw-loader!./demos/basic/accordion-basic.html'),
    type: NgbdAccordionBasic
  },
  static: {
    title: 'One open panel at a time',
    code: require('!!raw-loader!./demos/static/accordion-static'),
    markup: require('!!raw-loader!./demos/static/accordion-static.html'),
    type: NgbdAccordionStatic
  },
  toggle: {
    title: 'Toggle panels',
    code: require('!!raw-loader!./demos/toggle/accordion-toggle'),
    markup: require('!!raw-loader!./demos/toggle/accordion-toggle.html'),
    type: NgbdAccordionToggle
  },
  header: {
    title: 'Custom header',
    code: require('!!raw-loader!./demos/header/accordion-header'),
    markup: require('!!raw-loader!./demos/header/accordion-header.html'),
    type: NgbdAccordionHeader
  },
  preventchange: {
    title: 'Prevent panel toggle',
    code: require('!!raw-loader!./demos/preventchange/accordion-preventchange'),
    markup: require('!!raw-loader!./demos/preventchange/accordion-preventchange.html'),
    type: NgbdAccordionPreventchange
  },
  config: {
    title: 'Global configuration of accordions',
    code: require('!!raw-loader!./demos/config/accordion-config'),
    markup: require('!!raw-loader!./demos/config/accordion-config.html'),
    type: NgbdAccordionConfig
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
    NgbdAccordionBasicModule,
    NgbdAccordionConfigModule,
    NgbdAccordionHeaderModule,
    NgbdAccordionToggleModule,
    NgbdAccordionStaticModule,
    NgbdAccordionPreventchangeModule
  ]
})
export class NgbdAccordionModule {
  constructor(demoList: NgbdDemoList) {
    demoList.register('accordion', DEMOS);
  }
}
