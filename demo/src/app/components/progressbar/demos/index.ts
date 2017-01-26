import {NgbdProgressbarBasic} from './basic/progressbar-basic';
import {NgbdProgressbarStriped} from './striped/progressbar-striped';
import {NgbdProgressbarConfig} from './config/progressbar-config';
import {NgbdProgressbarLabels} from './labels/progressbar-labels';

export const DEMO_DIRECTIVES = [NgbdProgressbarBasic, NgbdProgressbarStriped, NgbdProgressbarConfig, NgbdProgressbarLabels];

export const DEMO_SNIPPETS = {
  basic: {
    code: require('!!prismjs-loader?lang=typescript!./basic/progressbar-basic'),
    markup: require('!!prismjs-loader?lang=markup!./basic/progressbar-basic.html')},
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
