import {NgbdProgressbarBasic} from './basic/progressbar-basic';
import {NgbdProgressbarShowValue} from './showvalue/progressbar-showvalue';
import {NgbdProgressbarStriped} from './striped/progressbar-striped';
import {NgbdProgressbarConfig} from './config/progressbar-config';
import {NgbdProgressbarLabels} from './labels/progressbar-labels';

export const DEMO_DIRECTIVES = [
  NgbdProgressbarBasic,
  NgbdProgressbarShowValue,
  NgbdProgressbarStriped,
  NgbdProgressbarConfig,
  NgbdProgressbarLabels
];

export const DEMO_SNIPPETS = {
  basic: {
    code: require('!!prismjs-loader?lang=typescript!./basic/progressbar-basic'),
    markup: require('!!prismjs-loader?lang=markup!./basic/progressbar-basic.html')},
  showvalue: {
    code: require('!!prismjs-loader?lang=typescript!./showvalue/progressbar-showvalue'),
    markup: require('!!prismjs-loader?lang=markup!./showvalue/progressbar-showvalue.html')},
  striped: {
    code: require('!!prismjs-loader?lang=typescript!./striped/progressbar-striped'),
    markup: require('!!prismjs-loader?lang=markup!./striped/progressbar-striped.html')},
  labels: {
    code: require('!!prismjs-loader?lang=typescript!./labels/progressbar-labels'),
    markup: require('!!prismjs-loader?lang=markup!./labels/progressbar-labels.html')},
  config: {
    code: require('!!prismjs-loader?lang=typescript!./config/progressbar-config'),
    markup: require('!!prismjs-loader?lang=markup!./config/progressbar-config.html')}
};
