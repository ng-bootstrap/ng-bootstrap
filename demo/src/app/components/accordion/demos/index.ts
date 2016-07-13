import {NgbdAccordionBasic} from './basic/accordion-basic';
import {NgbdAccordionPreventChange} from './preventChange/accordion-preventChange';
import {NgbdAccordionStatic} from './static/accordion-static';
import {NgbdAccordionToggle} from './toggle/accordion-toggle';

export const DEMO_DIRECTIVES =
    [NgbdAccordionBasic, NgbdAccordionPreventChange, NgbdAccordionStatic, NgbdAccordionToggle];

export const DEMO_SNIPPETS = {
  basic: {
    code: require('!!prismjs?lang=typescript!./basic/accordion-basic'),
    markup: require('!!prismjs?lang=markup!./basic/accordion-basic.html')
  },
  preventChange: {
    code: require('!!prismjs?lang=typescript!./preventChange/accordion-preventChange'),
    markup: require('!!prismjs?lang=markup!./preventChange/accordion-preventChange.html')
  },
  static: {
    code: require('!!prismjs?lang=typescript!./static/accordion-static'),
    markup: require('!!prismjs?lang=markup!./static/accordion-static.html')
  },
  toggle: {
    code: require('!!prismjs?lang=typescript!./toggle/accordion-toggle'),
    markup: require('!!prismjs?lang=markup!./toggle/accordion-toggle.html')
  }
};
