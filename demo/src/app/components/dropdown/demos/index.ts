import {NgbdDropdownBasic} from './basic/dropdown-basic';
import {NgbdDropdownConfig} from './config/dropdown-config';
import {NgbdDropdownManual} from './manual/dropdown-manual';

export const DEMO_DIRECTIVES = [NgbdDropdownBasic, NgbdDropdownConfig, NgbdDropdownManual];

export const DEMO_SNIPPETS = {
  'basic': {
    'code': require('!!prismjs?lang=typescript!./basic/dropdown-basic'),
    'markup': require('!!prismjs?lang=markup!./basic/dropdown-basic.html')},
  'config': {
    'code': require('!!prismjs?lang=typescript!./config/dropdown-config'),
    'markup': require('!!prismjs?lang=markup!./config/dropdown-config.html')},
  'manual': {
    'code': require('!!prismjs?lang=typescript!./manual/dropdown-manual'),
    'markup': require('!!prismjs?lang=markup!./manual/dropdown-manual.html')}
};
