import {NgbdPaginationAdvanced} from './advanced/pagination-advanced';
import {NgbdPaginationBasic} from './basic/pagination-basic';
import {NgbdPaginationSize} from './size/pagination-size';
import {NgbdPaginationConfig} from './config/pagination-config';
import {NgbdPaginationDisabled} from './disabled/pagination-disabled';

export const DEMO_DIRECTIVES = [
  NgbdPaginationAdvanced, NgbdPaginationBasic, NgbdPaginationSize, NgbdPaginationConfig, NgbdPaginationDisabled
];

export const DEMO_SNIPPETS = {
  advanced: {
    code: require('!!prismjs-loader?lang=typescript!./advanced/pagination-advanced'),
    markup: require('!!prismjs-loader?lang=markup!./advanced/pagination-advanced.html')
  },
  basic: {
    code: require('!!prismjs-loader?lang=typescript!./basic/pagination-basic'),
    markup: require('!!prismjs-loader?lang=markup!./basic/pagination-basic.html')
  },
  size: {
    code: require('!!prismjs-loader?lang=typescript!./size/pagination-size'),
    markup: require('!!prismjs-loader?lang=markup!./size/pagination-size.html')
  },
  disabled: {
    code: require('!!prismjs-loader?lang=typescript!./disabled/pagination-disabled'),
    markup: require('!!prismjs-loader?lang=markup!./disabled/pagination-disabled.html')
  },
  config: {
    code: require('!!prismjs-loader?lang=typescript!./config/pagination-config'),
    markup: require('!!prismjs-loader?lang=markup!./config/pagination-config.html')
  }
};
