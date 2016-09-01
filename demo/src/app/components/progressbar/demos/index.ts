import {NgbdProgressbarBasic} from './basic/progressbar-basic';
import {NgbdProgressbarStriped} from './striped/progressbar-striped';
import {NgbdProgressbarConfig} from './config/progressbar-config';

export const DEMO_DIRECTIVES = [NgbdProgressbarBasic, NgbdProgressbarStriped, NgbdProgressbarConfig];

export const DEMO_SNIPPETS = {
  basic: {
    code: require('!!prismjs?lang=typescript!./basic/progressbar-basic'),
    markup: require('!!prismjs?lang=markup!./basic/progressbar-basic.html')},
  striped: {
    code: require('!!prismjs?lang=typescript!./striped/progressbar-striped'),
    markup: require('!!prismjs?lang=markup!./striped/progressbar-striped.html')},
  config: {
    code: require('!!prismjs?lang=typescript!./config/progressbar-config'),
    markup: require('!!prismjs?lang=markup!./config/progressbar-config.html')}
};
