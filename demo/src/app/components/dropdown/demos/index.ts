import {NgbdDropdownBasic} from './basic/dropdown-basic';
import {NgbdDropdownConfig} from './config/dropdown-config';
import {NgbdDropdownManual} from './manual/dropdown-manual';

export const DEMO_DIRECTIVES = [NgbdDropdownBasic, NgbdDropdownConfig, NgbdDropdownManual];

export const DEMO_SNIPPETS = {
  'basic': {
    'code': require('!!prismjs-loader?lang=typescript!./basic/dropdown-basic'),
    'markup': require('!!prismjs-loader?lang=markup!./basic/dropdown-basic.html')},
  'config': {
    'code': require('!!prismjs-loader?lang=typescript!./config/dropdown-config'),
    'markup': require('!!prismjs-loader?lang=markup!./config/dropdown-config.html')},
  'manual': {
    'code': require('!!prismjs-loader?lang=typescript!./manual/dropdown-manual'),
    'markup': require('!!prismjs-loader?lang=markup!./manual/dropdown-manual.html')}
};
