import {NgbdTimepickerBasic} from './basic/timepicker-basic';
import {NgbdTimepickerMeridian} from './meridian/timepicker-meridian';
import {NgbdTimepickerSeconds} from './seconds/timepicker-seconds';
import {NgbdTimepickerSteps} from './steps/timepicker-steps';
import {NgbdTimepickerValidation} from './validation/timepicker-validation';
import {NgbdTimepickerSpinners} from './spinners/timepicker-spinners';
import {NgbdTimepickerConfig} from './config/timepicker-config';
import {NgbdTimepickerAdapter} from './adapter/timepicker-adapter';

export const DEMO_DIRECTIVES = [
  NgbdTimepickerBasic, NgbdTimepickerMeridian, NgbdTimepickerSeconds, NgbdTimepickerSpinners, NgbdTimepickerSteps,
  NgbdTimepickerValidation, NgbdTimepickerAdapter, NgbdTimepickerConfig
];

export const DEMO_SNIPPETS = {
  'basic': {
    'code': require('!!raw-loader!./basic/timepicker-basic'),
    'markup': require('!!raw-loader!./basic/timepicker-basic.html')
  },
  'meridian': {
    'code': require('!!raw-loader!./meridian/timepicker-meridian'),
    'markup': require('!!raw-loader!./meridian/timepicker-meridian.html')
  },
  'seconds': {
    'code': require('!!raw-loader!./seconds/timepicker-seconds'),
    'markup': require('!!raw-loader!./seconds/timepicker-seconds.html')
  },
  'spinners': {
    'code': require('!!raw-loader!./spinners/timepicker-spinners'),
    'markup': require('!!raw-loader!./spinners/timepicker-spinners.html')
  },
  'steps': {
    'code': require('!!raw-loader!./steps/timepicker-steps'),
    'markup': require('!!raw-loader!./steps/timepicker-steps.html')
  },
  'validation': {
    'code': require('!!raw-loader!./validation/timepicker-validation'),
    'markup': require('!!raw-loader!./validation/timepicker-validation.html')
  },
  'adapter': {
    'code': require('!!raw-loader!./adapter/timepicker-adapter'),
    'markup': require('!!raw-loader!./adapter/timepicker-adapter.html')
  },
  'config': {
    'code': require('!!raw-loader!./config/timepicker-config'),
    'markup': require('!!raw-loader!./config/timepicker-config.html')
  }
};
