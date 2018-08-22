import { NgModule } from '@angular/core';

import { NgbdSharedModule } from '../../shared';
import { ComponentWrapper } from '../../shared/component-wrapper/component-wrapper.component';
import { NgbdComponentsSharedModule, NgbdDemoList } from '../shared';
import { NgbdApiPage } from '../shared/api-page/api.component';
import { NgbdExamplesPage } from '../shared/examples-page/examples.component';
import { NgbdRatingBasic } from './demos/basic/rating-basic';
import { NgbdRatingConfig } from './demos/config/rating-config';
import { NgbdRatingDecimal } from './demos/decimal/rating-decimal';
import { NgbdRatingEvents } from './demos/events/rating-events';
import { NgbdRatingForm } from './demos/form/rating-form';
import { NgbdRatingTemplate } from './demos/template/rating-template';

const DEMO_DIRECTIVES = [
  NgbdRatingBasic,
  NgbdRatingConfig,
  NgbdRatingTemplate,
  NgbdRatingEvents,
  NgbdRatingDecimal,
  NgbdRatingForm
];

const DEMOS = {
  basic: {
    title: 'Basic demo',
    type: NgbdRatingBasic,
    code: require('!!raw-loader!./demos/basic/rating-basic'),
    markup: require('!!raw-loader!./demos/basic/rating-basic.html')
  },
  events: {
    title: 'Events and readonly ratings',
    type: NgbdRatingEvents,
    code: require('!!raw-loader!./demos/events/rating-events'),
    markup: require('!!raw-loader!./demos/events/rating-events.html')
  },
  template: {
    title: 'Custom star template',
    type: NgbdRatingTemplate,
    code: require('!!raw-loader!./demos/template/rating-template'),
    markup: require('!!raw-loader!./demos/template/rating-template.html')
  },
  decimal: {
    title: 'Custom decimal rating',
    type: NgbdRatingDecimal,
    code: require('!!raw-loader!./demos/decimal/rating-decimal'),
    markup: require('!!raw-loader!./demos/decimal/rating-decimal.html')
  },
  form: {
    title: 'Form integration',
    type: NgbdRatingForm,
    code: require('!!raw-loader!./demos/form/rating-form'),
    markup: require('!!raw-loader!./demos/form/rating-form.html')
  },
  config: {
    title: 'Global configuration of ratings',
    type: NgbdRatingConfig,
    code: require('!!raw-loader!./demos/config/rating-config'),
    markup: require('!!raw-loader!./demos/config/rating-config.html')
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
export class NgbdRatingModule {
  constructor(demoList: NgbdDemoList) {
    demoList.register('rating', DEMOS);
  }
}
