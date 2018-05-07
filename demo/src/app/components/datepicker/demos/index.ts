import {NgbdDatepickerAdapter} from './adapter/datepicker-adapter';
import {NgbdDatepickerBasic} from './basic/datepicker-basic';
import {NgbdDatepickerConfig} from './config/datepicker-config';
import {NgbdDatepickerI18n} from './i18n/datepicker-i18n';
import {NgbdDatepickerDisabled} from './disabled/datepicker-disabled';
import {NgbdDatepickerPopup} from './popup/datepicker-popup';
import {NgbdDatepickerCustomday} from './customday/datepicker-customday';
import {NgbdDatepickerMultiple} from './multiple/datepicker-multiple';
import {NgbdDatepickerCalendars, NgbdIslamicCivil, NgbdIslamicUmalqura} from './calendars/datepicker-calendars';
import {NgbdDatepickerRange} from './range/datepicker-range';

export const DEMO_DIRECTIVES = [
  NgbdDatepickerBasic, NgbdDatepickerPopup, NgbdDatepickerDisabled, NgbdDatepickerI18n,
  NgbdDatepickerCustomday, NgbdDatepickerConfig, NgbdDatepickerMultiple, NgbdDatepickerCalendars,
  NgbdDatepickerRange, NgbdIslamicCivil, NgbdIslamicUmalqura, NgbdDatepickerAdapter
];

export const DEMO_SNIPPETS = {
  'basic': {
    'code': require('!!raw-loader!./basic/datepicker-basic'),
    'markup': require('!!raw-loader!./basic/datepicker-basic.html')
  },
  'popup': {
    'code': require('!!raw-loader!./popup/datepicker-popup'),
    'markup': require('!!raw-loader!./popup/datepicker-popup.html')
  },
  'disabled': {
    'code': require('!!raw-loader!./disabled/datepicker-disabled'),
    'markup': require('!!raw-loader!./disabled/datepicker-disabled.html')
  },
  'i18n': {
    'code': require('!!raw-loader!./i18n/datepicker-i18n'),
    'markup': require('!!raw-loader!./i18n/datepicker-i18n.html')
  },
  'customday': {
    'code': require('!!raw-loader!./customday/datepicker-customday'),
    'markup': require('!!raw-loader!./customday/datepicker-customday.html')
  },
  'multiple': {
    'code': require('!!raw-loader!./multiple/datepicker-multiple'),
    'markup': require('!!raw-loader!./multiple/datepicker-multiple.html')
  },
  'range': {
    'code': require('!!raw-loader!./range/datepicker-range'),
    'markup': require('!!raw-loader!./range/datepicker-range.html')
  },
  'calendars': {
    'code': require('!!raw-loader!./calendars/datepicker-calendars'),
    'markup': require('!!raw-loader!./calendars/datepicker-calendars.html')
  },
  'adapter': {
    'code': require('!!raw-loader!./adapter/datepicker-adapter'),
    'markup': require('!!raw-loader!./adapter/datepicker-adapter.html')
  },
  'config': {
    'code': require('!!raw-loader!./config/datepicker-config'),
    'markup': require('!!raw-loader!./config/datepicker-config.html')
  }
};
