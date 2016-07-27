import {NgbdRatingBasic} from './basic/rating-basic';
import {NgbdRatingConfig} from './config/rating-config';
import {NgbdRatingTemplate} from './template/rating-template';
import {NgbdRatingEvents} from './events/rating-events';
import {NgbdRatingDecimal} from './decimal/rating-decimal';

export const DEMO_DIRECTIVES = [NgbdRatingBasic, NgbdRatingConfig,
  NgbdRatingTemplate, NgbdRatingEvents, NgbdRatingDecimal];

export const DEMO_SNIPPETS = {
  basic: {
    code: require('!!prismjs?lang=typescript!./basic/rating-basic'),
    markup: require('!!prismjs?lang=markup!./basic/rating-basic.html')
  },
  events: {
    code: require('!!prismjs?lang=typescript!./events/rating-events'),
    markup: require('!!prismjs?lang=markup!./events/rating-events.html')
  },
  template: {
    code: require('!!prismjs?lang=typescript!./template/rating-template'),
    markup: require('!!prismjs?lang=markup!./template/rating-template.html')
  },
  decimal: {
    code: require('!!prismjs?lang=typescript!./decimal/rating-decimal'),
    markup: require('!!prismjs?lang=markup!./decimal/rating-decimal.html')
  },
  config: {
    code: require('!!prismjs?lang=typescript!./config/rating-config'),
    markup: require('!!prismjs?lang=markup!./config/rating-config.html')
  }
};
