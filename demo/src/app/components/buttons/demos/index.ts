import {NgbdCheckboxBasic} from './checkbox/checkbox-basic';
import {NgbdRadioBasic} from './radio/radio-basic';

export const DEMO_DIRECTIVES = [NgbdCheckboxBasic, NgbdRadioBasic];

export const DEMO_SNIPPETS = {
  "checkbox": {
    "code": require('!!prismjs?lang=typescript!./checkbox/checkbox-basic'),
    "markup": require('!!prismjs?lang=markup!./checkbox/checkbox-basic.html')},
  "radio": {
    "code": require('!!prismjs?lang=typescript!./radio/radio-basic'),
    "markup": require('!!prismjs?lang=markup!./radio/radio-basic.html')}
};
