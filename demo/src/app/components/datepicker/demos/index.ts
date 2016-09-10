import {NgbdDatepickerBasic} from './basic/datepicker-basic';
import {NgbdDatepickerConfig} from './config/datepicker-config';
import {NgbdDatepickerI18n} from './i18n/datepicker-i18n';

export const DEMO_DIRECTIVES = [NgbdDatepickerBasic, NgbdDatepickerI18n, NgbdDatepickerConfig];

export const DEMO_SNIPPETS = {
  basic: {
    code: require('!!prismjs?lang=typescript!./basic/datepicker-basic'),
    markup: require('!!prismjs?lang=markup!./basic/datepicker-basic.html')
  },
  i18n: {
    code: require('!!prismjs?lang=typescript!./i18n/datepicker-i18n'),
    markup: require('!!prismjs?lang=markup!./i18n/datepicker-i18n.html')
  },
  config: {
    code: require('!!prismjs?lang=typescript!./config/datepicker-config'),
    markup: require('!!prismjs?lang=markup!./config/datepicker-config.html')
  }
};
