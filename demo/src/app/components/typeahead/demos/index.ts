import {NgbdTypeaheadFormat} from './format/typeahead-format';
import {NgbdTypeaheadHttp} from './http/typeahead-http';
import {NgbdTypeaheadBasic} from './basic/typeahead-basic';
import {NgbdTypeaheadTemplate} from './template/typeahead-template';
import {NgbdTypeaheadConfig} from './config/typeahead-config';

export const DEMO_DIRECTIVES =
    [NgbdTypeaheadFormat, NgbdTypeaheadHttp, NgbdTypeaheadBasic, NgbdTypeaheadTemplate, NgbdTypeaheadConfig];

export const DEMO_SNIPPETS = {
  basic: {
    code: require('!!prismjs?lang=typescript!./basic/typeahead-basic'),
    markup: require('!!prismjs?lang=markup!./basic/typeahead-basic.html')
  },
  format: {
    code: require('!!prismjs?lang=typescript!./format/typeahead-format'),
    markup: require('!!prismjs?lang=markup!./format/typeahead-format.html')
  },
  http: {
    code: require('!!prismjs?lang=typescript!./http/typeahead-http'),
    markup: require('!!prismjs?lang=markup!./http/typeahead-http.html')
  },
  template: {
    code: require('!!prismjs?lang=typescript!./template/typeahead-template'),
    markup: require('!!prismjs?lang=markup!./template/typeahead-template.html')
  },
  config: {
    code: require('!!prismjs?lang=typescript!./config/typeahead-config'),
    markup: require('!!prismjs?lang=markup!./config/typeahead-config.html')
  }
};
