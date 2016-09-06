import {NgbdDropdownBasic} from './basic/dropdown-basic';
import {NgbdDropdownConfig} from './config/dropdown-config';

export const DEMO_DIRECTIVES = [NgbdDropdownBasic, NgbdDropdownConfig];

export const DEMO_SNIPPETS = {
  basic: {
    code: require('!!prismjs?lang=typescript!./basic/dropdown-basic'),
    markup: require('!!prismjs?lang=markup!./basic/dropdown-basic.html')
  },
  config: {
    code: require('!!prismjs?lang=typescript!./config/dropdown-config'),
    markup: require('!!prismjs?lang=markup!./config/dropdown-config.html')
  }
};
