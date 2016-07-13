import {NgbdAlertBasic} from './basic/alert-basic';
import {NgbdAlertCloseable} from './closeable/alert-closeable';
import {NgbdAlertCustom} from './custom/alert-custom';
import {NgbdAlertSelfClosing} from './selfClosing/alert-selfClosing';

export const DEMO_DIRECTIVES = [NgbdAlertBasic, NgbdAlertCloseable, NgbdAlertCustom, NgbdAlertSelfClosing];

export const DEMO_SNIPPETS = {
  basic: {
    code: require('!!prismjs?lang=typescript!./basic/alert-basic'),
    markup: require('!!prismjs?lang=markup!./basic/alert-basic.html')},
  closeable: {
    code: require('!!prismjs?lang=typescript!./closeable/alert-closeable'),
    markup: require('!!prismjs?lang=markup!./closeable/alert-closeable.html')},
  custom: {
    code: require('!!prismjs?lang=typescript!./custom/alert-custom'),
    markup: require('!!prismjs?lang=markup!./custom/alert-custom.html')},
  selfClosing: {
    code: require('!!prismjs?lang=typescript!./selfClosing/alert-selfClosing'),
    markup: require('!!prismjs?lang=markup!./selfClosing/alert-selfClosing.html')}
};
