import {NgbdPaginationAdvanced} from './advanced/pagination-advanced';
import {NgbdPaginationBasic} from './basic/pagination-basic';
import {NgbdPaginationSize} from './size/pagination-size';
import {NgbdPaginationConfig} from './config/pagination-config';

export const DEMO_DIRECTIVES = [NgbdPaginationAdvanced, NgbdPaginationBasic, NgbdPaginationSize, NgbdPaginationConfig];

export const DEMO_SNIPPETS = {
  advanced: {
    code: require('!!prismjs?lang=typescript!./advanced/pagination-advanced'),
    markup: require('!!prismjs?lang=markup!./advanced/pagination-advanced.html')
  },
  basic: {
    code: require('!!prismjs?lang=typescript!./basic/pagination-basic'),
    markup: require('!!prismjs?lang=markup!./basic/pagination-basic.html')
  },
  size: {
    code: require('!!prismjs?lang=typescript!./size/pagination-size'),
    markup: require('!!prismjs?lang=markup!./size/pagination-size.html')
  },
  config: {
    code: require('!!prismjs?lang=typescript!./config/pagination-config'),
    markup: require('!!prismjs?lang=markup!./config/pagination-config.html')
  }
};
