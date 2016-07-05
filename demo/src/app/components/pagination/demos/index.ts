import {NgbdPaginationBasic} from './basic/pagination-basic';
import {NgbdPaginationAdvanced} from './advanced/pagination-advanced';

export const DEMO_DIRECTIVES = [NgbdPaginationBasic, NgbdPaginationAdvanced];

export const DEMO_SNIPPETS = {
  "basic": {
    "code": require('!!prismjs?lang=typescript!./basic/pagination-basic'),
    "markup": require('!!prismjs?lang=markup!./basic/pagination-basic.html')
  },
  "advanced": {
    "code": require('!!prismjs?lang=typescript!./advanced/pagination-advanced'),
    "markup": require('!!prismjs?lang=markup!./advanced/pagination-advanced.html')
  }
};
