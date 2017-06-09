import {NgbdTimepickerBasic} from './basic/timepicker-basic';
import {NgbdTimepickerMeridian} from './meridian/timepicker-meridian';
import {NgbdTimepickerSeconds} from './seconds/timepicker-seconds';
import {NgbdTimepickerSteps} from './steps/timepicker-steps';
import {NgbdTimepickerValidation} from './validation/timepicker-validation';
import {NgbdTimepickerSpinners} from './spinners/timepicker-spinners';
import {NgbdTimepickerConfig} from './config/timepicker-config';

export const DEMO_DIRECTIVES = [
  NgbdTimepickerBasic, NgbdTimepickerMeridian, NgbdTimepickerSeconds, NgbdTimepickerSpinners, NgbdTimepickerSteps,
  NgbdTimepickerValidation, NgbdTimepickerConfig
];

export const DEMO_SNIPPETS = {
  'basic': {
    'code': require('!!prismjs-loader?lang=typescript!./basic/timepicker-basic'),
    'markup': require('!!prismjs-loader?lang=markup!./basic/timepicker-basic.html')
  },
  'meridian': {
    'code': require('!!prismjs-loader?lang=typescript!./meridian/timepicker-meridian'),
    'markup': require('!!prismjs-loader?lang=markup!./meridian/timepicker-meridian.html')
  },
  'seconds': {
    'code': require('!!prismjs-loader?lang=typescript!./seconds/timepicker-seconds'),
    'markup': require('!!prismjs-loader?lang=markup!./seconds/timepicker-seconds.html')
  },
  'spinners': {
    'code': require('!!prismjs-loader?lang=typescript!./spinners/timepicker-spinners'),
    'markup': require('!!prismjs-loader?lang=markup!./spinners/timepicker-spinners.html')
  },
  'steps': {
    'code': require('!!prismjs-loader?lang=typescript!./steps/timepicker-steps'),
    'markup': require('!!prismjs-loader?lang=markup!./steps/timepicker-steps.html')
  },
  'validation': {
    'code': require('!!prismjs-loader?lang=typescript!./validation/timepicker-validation'),
    'markup': require('!!prismjs-loader?lang=markup!./validation/timepicker-validation.html')
  },
  'config': {
    'code': require('!!prismjs-loader?lang=typescript!./config/timepicker-config'),
    'markup': require('!!prismjs-loader?lang=markup!./config/timepicker-config.html')
  }
};
