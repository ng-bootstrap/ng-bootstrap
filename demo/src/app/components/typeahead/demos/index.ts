import {NgbdTypeaheadFormat} from './format/typeahead-format';
import {NgbdTypeaheadHttp} from './http/typeahead-http';
import {NgbdTypeaheadBasic} from './basic/typeahead-basic';
import {NgbdTypeaheadFocus} from './focus/typeahead-focus';
import {NgbdTypeaheadTemplate} from './template/typeahead-template';
import {NgbdTypeaheadConfig} from './config/typeahead-config';

export const DEMO_DIRECTIVES =
    [NgbdTypeaheadFormat, NgbdTypeaheadHttp, NgbdTypeaheadBasic, NgbdTypeaheadFocus, NgbdTypeaheadTemplate, NgbdTypeaheadConfig];

export const DEMO_SNIPPETS = {
  'basic': {
    'code': require('!!raw-loader!./basic/typeahead-basic'),
    'markup': require('!!raw-loader!./basic/typeahead-basic.html')
  },
  'focus': {
    'code': require('!!raw-loader!./focus/typeahead-focus'),
    'markup': require('!!raw-loader!./focus/typeahead-focus.html')
  },
  'format': {
    'code': require('!!raw-loader!./format/typeahead-format'),
    'markup': require('!!raw-loader!./format/typeahead-format.html')
  },
  'http': {
    'code': require('!!raw-loader!./http/typeahead-http'),
    'markup': require('!!raw-loader!./http/typeahead-http.html')
  },
  'template': {
    'code': require('!!raw-loader!./template/typeahead-template'),
    'markup': require('!!raw-loader!./template/typeahead-template.html')
  },
  'config': {
    'code': require('!!raw-loader!./config/typeahead-config'),
    'markup': require('!!raw-loader!./config/typeahead-config.html')
  }
};
