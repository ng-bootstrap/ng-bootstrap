import {NgbdAlertBasic} from './basic/alert-basic';
import {NgbdAlertCloseable} from './closeable/alert-closeable';
import {NgbdAlertCustom} from './custom/alert-custom';
import {NgbdAlertSelfclosing} from './selfclosing/alert-selfclosing';
import {NgbdAlertConfig} from './config/alert-config';

export const DEMO_DIRECTIVES =
    [NgbdAlertBasic, NgbdAlertCloseable, NgbdAlertCustom, NgbdAlertSelfclosing, NgbdAlertConfig];

export const DEMO_SNIPPETS = {
  'basic': {
    'code': require('!!raw-loader!./basic/alert-basic'),
    'markup': require('!!raw-loader!./basic/alert-basic.html')
  },
  'closeable': {
    'code': require('!!raw-loader!./closeable/alert-closeable'),
    'markup': require('!!raw-loader!./closeable/alert-closeable.html')
  },
  'custom': {
    'code': require('!!raw-loader!./custom/alert-custom'),
    'markup': require('!!raw-loader!./custom/alert-custom.html')
  },
  'selfclosing': {
    'code': require('!!raw-loader!./selfclosing/alert-selfclosing'),
    'markup': require('!!raw-loader!./selfclosing/alert-selfclosing.html')
  },
  'config': {
    'code': require('!!raw-loader!./config/alert-config'),
    'markup': require('!!raw-loader!./config/alert-config.html')
  }
};
