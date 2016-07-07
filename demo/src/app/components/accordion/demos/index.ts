import {NgbdAccordionBasic} from './basic/accordion-basic';
import {NgbdAccordionStatic} from './static/accordion-static';

export const DEMO_DIRECTIVES = [NgbdAccordionBasic, NgbdAccordionStatic];

export const DEMO_SNIPPETS = {
  "basic": {
    "code": require('!!prismjs?lang=typescript!./basic/accordion-basic'),
    "markup": require('!!prismjs?lang=markup!./basic/accordion-basic.html')},
  "static": {
    "code": require('!!prismjs?lang=typescript!./static/accordion-static'),
    "markup": require('!!prismjs?lang=markup!./static/accordion-static.html')}
};
