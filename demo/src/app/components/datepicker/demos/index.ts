import {NgbdDatepickerBasic} from './basic/datepicker-basic';
import {NgbdDatepickerConfig} from './config/datepicker-config';

export const DEMO_DIRECTIVES = [NgbdDatepickerBasic, NgbdDatepickerConfig];

export const DEMO_SNIPPETS = {
  basic: {
    code: require('!!prismjs?lang=typescript!./basic/datepicker-basic'),
    markup: require('!!prismjs?lang=markup!./basic/datepicker-basic.html')
  },
  config: {
    code: require('!!prismjs?lang=typescript!./config/datepicker-config'),
    markup: require('!!prismjs?lang=markup!./config/datepicker-config.html')
  }
};
