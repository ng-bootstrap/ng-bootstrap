import {RatingBasicComponent} from './basic/basic.component';
import {RatingConfigComponent} from './config/config.component';
import {RatingTemplateComponent} from './template/template.component';
import {RatingEventsComponent} from './events/events.component';
import {RatingDecimalComponent} from './decimal/decimal.component';

export const DEMO_DIRECTIVES = [RatingBasicComponent, RatingConfigComponent,
  RatingEventsComponent, RatingTemplateComponent, RatingDecimalComponent];

export const DEMO_SNIPPETS = {
  basic: {
    code: require('!!prismjs?lang=typescript!./basic/basic.component'),
    markup: require('!!prismjs?lang=markup!./basic/basic.component.html')
  },
  events: {
    code: require('!!prismjs?lang=typescript!./events/events.component'),
    markup: require('!!prismjs?lang=markup!./events/events.component.html')
  },
  template: {
    code: require('!!prismjs?lang=typescript!./template/template.component'),
    markup: require('!!prismjs?lang=markup!./template/template.component.html')
  },
  decimal: {
    code: require('!!prismjs?lang=typescript!./decimal/decimal.component'),
    markup: require('!!prismjs?lang=markup!./decimal/decimal.component.html')
  },
  config: {
    code: require('!!prismjs?lang=typescript!./config/config.component'),
    markup: require('!!prismjs?lang=markup!./config/config.component.html')
  }
};
