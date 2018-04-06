import {NgbdRatingBasic} from './basic/rating-basic';
import {NgbdRatingConfig} from './config/rating-config';
import {NgbdRatingTemplate} from './template/rating-template';
import {NgbdRatingEvents} from './events/rating-events';
import {NgbdRatingDecimal} from './decimal/rating-decimal';
import {NgbdRatingForm} from './form/rating-form';

export const DEMO_DIRECTIVES = [NgbdRatingBasic, NgbdRatingConfig,
  NgbdRatingTemplate, NgbdRatingEvents, NgbdRatingDecimal, NgbdRatingForm];

export const DEMO_SNIPPETS = {
  'basic': {
    'code': require('!!raw-loader!./basic/rating-basic'),
    'markup': require('!!raw-loader!./basic/rating-basic.html')
  },
  'events': {
    'code': require('!!raw-loader!./events/rating-events'),
    'markup': require('!!raw-loader!./events/rating-events.html')
  },
  'template': {
    'code': require('!!raw-loader!./template/rating-template'),
    'markup': require('!!raw-loader!./template/rating-template.html')
  },
  'decimal': {
    'code': require('!!raw-loader!./decimal/rating-decimal'),
    'markup': require('!!raw-loader!./decimal/rating-decimal.html')
  },
  'form': {
    'code': require('!!raw-loader!./form/rating-form'),
    'markup': require('!!raw-loader!./form/rating-form.html')
  },
  'config': {
    'code': require('!!raw-loader!./config/rating-config'),
    'markup': require('!!raw-loader!./config/rating-config.html')
  }
};
