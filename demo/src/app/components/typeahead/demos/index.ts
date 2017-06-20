import {NgbdTypeaheadFormat} from './format/typeahead-format';
import {NgbdTypeaheadHttp} from './http/typeahead-http';
import {NgbdTypeaheadBasic} from './basic/typeahead-basic';
import {NgbdTypeaheadTemplate} from './template/typeahead-template';
import {NgbdTypeaheadCustom} from './custom/typeahead-custom';
import {NgbdTypeaheadConfig} from './config/typeahead-config';

export const DEMO_DIRECTIVES = [
  NgbdTypeaheadFormat, NgbdTypeaheadHttp, NgbdTypeaheadBasic, NgbdTypeaheadTemplate, NgbdTypeaheadCustom,
  NgbdTypeaheadConfig
];

export const DEMO_SNIPPETS = {
  'basic': {
    'code': require('!!prismjs-loader?lang=typescript!./basic/typeahead-basic'),
    'markup': require('!!prismjs-loader?lang=markup!./basic/typeahead-basic.html')
  },
  'format': {
    'code': require('!!prismjs-loader?lang=typescript!./format/typeahead-format'),
    'markup': require('!!prismjs-loader?lang=markup!./format/typeahead-format.html')
  },
  'http': {
    'code': require('!!prismjs-loader?lang=typescript!./http/typeahead-http'),
    'markup': require('!!prismjs-loader?lang=markup!./http/typeahead-http.html')
  },
  'template': {
    'code': require('!!prismjs-loader?lang=typescript!./template/typeahead-template'),
    'markup': require('!!prismjs-loader?lang=markup!./template/typeahead-template.html')
  },
  'custom': {
    'code': require('!!prismjs-loader?lang=typescript!./custom/typeahead-custom'),
    'markup': require('!!prismjs-loader?lang=markup!./custom/typeahead-custom.html')
  },
  'config': {
    'code': require('!!prismjs-loader?lang=typescript!./config/typeahead-config'),
    'markup': require('!!prismjs-loader?lang=markup!./config/typeahead-config.html')
  }
};
