import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgbdSharedModule } from '../../shared';
import { ComponentWrapper } from '../../shared/component-wrapper/component.component';
import { NgbdComponentsSharedModule } from '../shared';
import { getApis, NgbdApiPage } from '../shared/api-page/api.component';
import { NgbdExamplesPage } from '../shared/examples-page/examples.component';
import { NgbdAccordionBasic } from './demos/basic/accordion-basic';
import { NgbdAccordionConfig } from './demos/config/accordion-config';
import { NgbdAccordionPreventchange } from './demos/preventchange/accordion-preventchange';
import { NgbdAccordionStatic } from './demos/static/accordion-static';
import { NgbdAccordionToggle } from './demos/toggle/accordion-toggle';

const DEMO_DIRECTIVES = [NgbdAccordionBasic, NgbdAccordionPreventchange, NgbdAccordionStatic, NgbdAccordionToggle, NgbdAccordionConfig];

const demos = {
  basic: {
    title: 'Accordion',
    type: NgbdAccordionBasic,
    code: require('!!raw-loader!./demos/basic/accordion-basic'),
    markup: require('!!raw-loader!./demos/basic/accordion-basic.html')
  },
  static: {
    title: 'One open panel at a time',
    type: NgbdAccordionStatic,
    code: require('!!raw-loader!./demos/static/accordion-static'),
    markup: require('!!raw-loader!./demos/static/accordion-static.html')
  },
  toggle: {
    title: 'Toggle panels',
    type: NgbdAccordionToggle,
    code: require('!!raw-loader!./demos/toggle/accordion-toggle'),
    markup: require('!!raw-loader!./demos/toggle/accordion-toggle.html')
  },
  preventchange: {
    title: 'Prevent panel toggle',
    type: NgbdAccordionPreventchange,
    code: require('!!raw-loader!./demos/preventchange/accordion-preventchange'),
    markup: require('!!raw-loader!./demos/preventchange/accordion-preventchange.html')
  },
  config: {
    title: 'Global configuration of accordions',
    type: NgbdAccordionConfig,
    code: require('!!raw-loader!./demos/config/accordion-config'),
    markup: require('!!raw-loader!./demos/config/accordion-config.html')
  }
};

const apis = getApis('accordion');

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
export class NgbdAccordionModule {}
