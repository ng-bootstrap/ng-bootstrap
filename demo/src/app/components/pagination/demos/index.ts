import {NgbdPaginationAdvanced} from './advanced/pagination-advanced';
import {NgbdPaginationBasic} from './basic/pagination-basic';
import {NgbdPaginationSize} from './size/pagination-size';
import {NgbdPaginationConfig} from './config/pagination-config';
import {NgbdPaginationDisabled} from './disabled/pagination-disabled';
import {NgbdPaginationJustify} from './justify/pagination-justify';

export const DEMO_DIRECTIVES = [
  NgbdPaginationAdvanced, NgbdPaginationBasic, NgbdPaginationSize, NgbdPaginationConfig, NgbdPaginationDisabled, NgbdPaginationJustify
];

export const DEMO_SNIPPETS = {
  'advanced': {
    'code': require('!!raw-loader!./advanced/pagination-advanced'),
    'markup': require('!!raw-loader!./advanced/pagination-advanced.html')
  },
  'basic': {
    'code': require('!!raw-loader!./basic/pagination-basic'),
    'markup': require('!!raw-loader!./basic/pagination-basic.html')
  },
  'justify': {
    'code': require('!!raw-loader!./justify/pagination-justify'),
    'markup': require('!!raw-loader!./justify/pagination-justify.html')
  },
  'size': {
    'code': require('!!raw-loader!./size/pagination-size'),
    'markup': require('!!raw-loader!./size/pagination-size.html')
  },
  'disabled': {
    'code': require('!!raw-loader!./disabled/pagination-disabled'),
    'markup': require('!!raw-loader!./disabled/pagination-disabled.html')
  },
  'config': {
    'code': require('!!raw-loader!./config/pagination-config'),
    'markup': require('!!raw-loader!./config/pagination-config.html')
  }
};
