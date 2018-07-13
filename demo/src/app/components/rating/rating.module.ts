import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgbdSharedModule } from '../../shared';
import { ComponentWrapper } from '../../shared/component-wrapper/component.component';
import { NgbdComponentsSharedModule } from '../shared';
import { getApis, NgbdApiPage } from '../shared/api-page/api.component';
import { NgbdExamplesPage } from '../shared/examples-page/examples.component';
import { NgbdRatingBasic } from './demos/basic/rating-basic';
import { NgbdRatingConfig } from './demos/config/rating-config';
import { NgbdRatingTemplate } from './demos/template/rating-template';
import { NgbdRatingEvents } from './demos/events/rating-events';
import { NgbdRatingDecimal } from './demos/decimal/rating-decimal';
import { NgbdRatingForm } from './demos/form/rating-form';

const DEMO_DIRECTIVES = [
  NgbdRatingBasic,
  NgbdRatingConfig,
  NgbdRatingTemplate,
  NgbdRatingEvents,
  NgbdRatingDecimal,
  NgbdRatingForm
];

const demos = {
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

const apis = getApis('rating');

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
  declarations: DEMO_DIRECTIVES,
  entryComponents: DEMO_DIRECTIVES
})
export class NgbdRatingModule {}
