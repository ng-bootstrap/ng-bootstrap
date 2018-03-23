import {NgbdDropdownBasic} from './basic/dropdown-basic';
import {NgbdDropdownConfig} from './config/dropdown-config';
import {NgbdDropdownManual} from './manual/dropdown-manual';
import {NgbdDropdownSplit} from './split/dropdown-split';

export const DEMO_DIRECTIVES = [NgbdDropdownBasic, NgbdDropdownConfig, NgbdDropdownManual, NgbdDropdownSplit];

export const DEMO_SNIPPETS = {
  'basic': {
    'code': require('!!raw-loader!./basic/dropdown-basic'),
    'markup': require('!!raw-loader!./basic/dropdown-basic.html')},
  'config': {
    'code': require('!!raw-loader!./config/dropdown-config'),
    'markup': require('!!raw-loader!./config/dropdown-config.html')},
  'manual': {
    'code': require('!!raw-loader!./manual/dropdown-manual'),
    'markup': require('!!raw-loader!./manual/dropdown-manual.html')},
  'split': {
    'code': require('!!raw-loader!./split/dropdown-split'),
    'markup': require('!!raw-loader!./split/dropdown-split.html')}
};
