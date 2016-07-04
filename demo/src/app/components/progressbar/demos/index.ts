import {NgbdProgressbarBasic} from './basic/progressbar-basic';
import {NgbdProgressbarStriped} from './striped/progressbar-striped';

export const DEMO_DIRECTIVES = [NgbdProgressbarBasic, NgbdProgressbarStriped];

export const DEMO_SNIPPETS = {
  "basic": {
    "code": require('!!prismjs?lang=typescript!./basic/progressbar-basic'),
    "markup": require('!!prismjs?lang=markup!./basic/progressbar-basic.html')},
  "striped": {
    "code": require('!!prismjs?lang=typescript!./striped/progressbar-striped'),
    "markup": require('!!prismjs?lang=markup!./striped/progressbar-striped.html')}
};
