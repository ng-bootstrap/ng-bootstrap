import {NgbdRatingBasic} from './basic/rating-basic';
import {NgbdRatingConfig} from './config/rating-config';
import {NgbdRatingTemplate} from './template/rating-template';
import {NgbdRatingEvents} from './events/rating-events';
import {NgbdRatingDecimal} from './decimal/rating-decimal';
import {NgbdRatingForm} from './form/rating-form';

export const DEMO_DIRECTIVES = [NgbdRatingBasic, NgbdRatingConfig,
  NgbdRatingTemplate, NgbdRatingEvents, NgbdRatingDecimal, NgbdRatingForm];

export const DEMO_SNIPPETS = {
  basic: {
    code: require('!!prismjs-loader?lang=typescript!./basic/rating-basic'),
    markup: require('!!prismjs-loader?lang=markup!./basic/rating-basic.html')
  },
  events: {
    code: require('!!prismjs-loader?lang=typescript!./events/rating-events'),
    markup: require('!!prismjs-loader?lang=markup!./events/rating-events.html')
  },
  template: {
    code: require('!!prismjs-loader?lang=typescript!./template/rating-template'),
    markup: require('!!prismjs-loader?lang=markup!./template/rating-template.html')
  },
  decimal: {
    code: require('!!prismjs-loader?lang=typescript!./decimal/rating-decimal'),
    markup: require('!!prismjs-loader?lang=markup!./decimal/rating-decimal.html')
  },
  form: {
    code: require('!!prismjs-loader?lang=typescript!./form/rating-form'),
    markup: require('!!prismjs-loader?lang=markup!./form/rating-form.html')
  },
  config: {
    code: require('!!prismjs-loader?lang=typescript!./config/rating-config'),
    markup: require('!!prismjs-loader?lang=markup!./config/rating-config.html')
  }
};
