import {NgbdAlertBasic} from './basic/alert-basic';
import {NgbdAlertCloseable} from './closeable/alert-closeable';
import {NgbdAlertCustom} from './custom/alert-custom';
import {NgbdAlertSelfclosing} from './selfclosing/alert-selfclosing';
import {NgbdAlertConfig} from './config/alert-config';

export const DEMO_DIRECTIVES =
    [NgbdAlertBasic, NgbdAlertCloseable, NgbdAlertCustom, NgbdAlertSelfclosing, NgbdAlertConfig];

export const DEMO_SNIPPETS = {
  basic: {
    code: require('!!prismjs?lang=typescript!./basic/alert-basic'),
    markup: require('!!prismjs?lang=markup!./basic/alert-basic.html')
  },
  closeable: {
    code: require('!!prismjs?lang=typescript!./closeable/alert-closeable'),
    markup: require('!!prismjs?lang=markup!./closeable/alert-closeable.html')
  },
  custom: {
    code: require('!!prismjs?lang=typescript!./custom/alert-custom'),
    markup: require('!!prismjs?lang=markup!./custom/alert-custom.html')
  },
  selfClosing: {
    code: require('!!prismjs?lang=typescript!./selfclosing/alert-selfclosing'),
    markup: require('!!prismjs?lang=markup!./selfclosing/alert-selfclosing.html')
  },
  config: {
    code: require('!!prismjs?lang=typescript!./config/alert-config'),
    markup: require('!!prismjs?lang=markup!./config/alert-config.html')
  }
};
