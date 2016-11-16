import {NgbdProgressbarBasic} from './basic/progressbar-basic';
import {NgbdProgressbarStriped} from './striped/progressbar-striped';
import {NgbdProgressbarConfig} from './config/progressbar-config';

export const DEMO_DIRECTIVES = [NgbdProgressbarBasic, NgbdProgressbarStriped, NgbdProgressbarConfig];

export const DEMO_SNIPPETS = {
  basic: {
    code: require('!!prismjs-loader?lang=typescript!./basic/progressbar-basic'),
    markup: require('!!prismjs-loader?lang=markup!./basic/progressbar-basic.html')},
  striped: {
    code: require('!!prismjs-loader?lang=typescript!./striped/progressbar-striped'),
    markup: require('!!prismjs-loader?lang=markup!./striped/progressbar-striped.html')},
  config: {
    code: require('!!prismjs-loader?lang=typescript!./config/progressbar-config'),
    markup: require('!!prismjs-loader?lang=markup!./config/progressbar-config.html')}
};
