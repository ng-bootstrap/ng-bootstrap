import {NgbdAccordionBasic} from './basic/accordion-basic';
import {NgbdAccordionPreventchange} from './preventchange/accordion-preventchange';
import {NgbdAccordionStatic} from './static/accordion-static';
import {NgbdAccordionToggle} from './toggle/accordion-toggle';
import {NgbdAccordionConfig} from './config/accordion-config';

export const DEMO_DIRECTIVES =
    [NgbdAccordionBasic, NgbdAccordionPreventchange, NgbdAccordionStatic, NgbdAccordionToggle, NgbdAccordionConfig];

export const DEMO_SNIPPETS = {
  'basic': {
    'code': require('!!raw-loader!./basic/accordion-basic'),
    'markup': require('!!raw-loader!./basic/accordion-basic.html')
  },
  'preventchange': {
    'code': require('!!raw-loader!./preventchange/accordion-preventchange'),
    'markup': require('!!raw-loader!./preventchange/accordion-preventchange.html')
  },
  'static': {
    'code': require('!!raw-loader!./static/accordion-static'),
    'markup': require('!!raw-loader!./static/accordion-static.html')
  },
  'toggle': {
    'code': require('!!raw-loader!./toggle/accordion-toggle'),
    'markup': require('!!raw-loader!./toggle/accordion-toggle.html')
  },
  'config': {
    'code': require('!!raw-loader!./config/accordion-config'),
    'markup': require('!!raw-loader!./config/accordion-config.html')
  }
};
