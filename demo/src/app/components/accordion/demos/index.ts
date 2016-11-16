import {NgbdAccordionBasic} from './basic/accordion-basic';
import {NgbdAccordionPreventchange} from './preventchange/accordion-preventchange';
import {NgbdAccordionStatic} from './static/accordion-static';
import {NgbdAccordionToggle} from './toggle/accordion-toggle';
import {NgbdAccordionConfig} from './config/accordion-config';

export const DEMO_DIRECTIVES =
    [NgbdAccordionBasic, NgbdAccordionPreventchange, NgbdAccordionStatic, NgbdAccordionToggle, NgbdAccordionConfig];

export const DEMO_SNIPPETS = {
  basic: {
    code: require('!!prismjs-loader?lang=typescript!./basic/accordion-basic'),
    markup: require('!!prismjs-loader?lang=markup!./basic/accordion-basic.html')
  },
  preventchange: {
    code: require('!!prismjs-loader?lang=typescript!./preventchange/accordion-preventchange'),
    markup: require('!!prismjs-loader?lang=markup!./preventchange/accordion-preventchange.html')
  },
  static: {
    code: require('!!prismjs-loader?lang=typescript!./static/accordion-static'),
    markup: require('!!prismjs-loader?lang=markup!./static/accordion-static.html')
  },
  toggle: {
    code: require('!!prismjs-loader?lang=typescript!./toggle/accordion-toggle'),
    markup: require('!!prismjs-loader?lang=markup!./toggle/accordion-toggle.html')
  },
  config: {
    code: require('!!prismjs-loader?lang=typescript!./config/accordion-config'),
    markup: require('!!prismjs-loader?lang=markup!./config/accordion-config.html')
  }
};
