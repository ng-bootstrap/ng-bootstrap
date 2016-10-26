import {NgbdAccordionBasic} from './basic/accordion-basic';
import {NgbdAccordionPreventchange} from './preventchange/accordion-preventchange';
import {NgbdAccordionStatic} from './static/accordion-static';
import {NgbdAccordionToggle} from './toggle/accordion-toggle';
import {NgbdAccordionConfig} from './config/accordion-config';

export const DEMO_DIRECTIVES =
    [NgbdAccordionBasic, NgbdAccordionPreventchange, NgbdAccordionStatic, NgbdAccordionToggle, NgbdAccordionConfig];

export const DEMO_SNIPPETS = {
  basic: {
    code: require('!!prismjs?lang=typescript!./basic/accordion-basic'),
    markup: require('!!prismjs?lang=markup!./basic/accordion-basic.html')
  },
  preventchange: {
    code: require('!!prismjs?lang=typescript!./preventchange/accordion-preventchange'),
    markup: require('!!prismjs?lang=markup!./preventchange/accordion-preventchange.html')
  },
  static: {
    code: require('!!prismjs?lang=typescript!./static/accordion-static'),
    markup: require('!!prismjs?lang=markup!./static/accordion-static.html')
  },
  toggle: {
    code: require('!!prismjs?lang=typescript!./toggle/accordion-toggle'),
    markup: require('!!prismjs?lang=markup!./toggle/accordion-toggle.html')
  },
  config: {
    code: require('!!prismjs?lang=typescript!./config/accordion-config'),
    markup: require('!!prismjs?lang=markup!./config/accordion-config.html')
  }
};
