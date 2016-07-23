import {NgbdTimepickerBasic} from './basic/timepicker-basic';
import {NgbdTimepickerMeridian} from './meridian/timepicker-meridian';
import {NgbdTimepickerSeconds} from './seconds/timepicker-seconds';
import {NgbdTimepickerSteps} from './steps/timepicker-steps';

export const DEMO_DIRECTIVES = [NgbdTimepickerBasic, NgbdTimepickerMeridian, NgbdTimepickerSeconds, NgbdTimepickerSteps];

export const DEMO_SNIPPETS = {
  basic: {
    code: require('!!prismjs?lang=typescript!./basic/timepicker-basic'),
    markup: require('!!prismjs?lang=markup!./basic/timepicker-basic.html')},
  meridian: {
    code: require('!!prismjs?lang=typescript!./meridian/timepicker-meridian'),
    markup: require('!!prismjs?lang=markup!./meridian/timepicker-meridian.html')},
  seconds: {
    code: require('!!prismjs?lang=typescript!./seconds/timepicker-seconds'),
    markup: require('!!prismjs?lang=markup!./seconds/timepicker-seconds.html')},
  steps: {
    code: require('!!prismjs?lang=typescript!./steps/timepicker-steps'),
    markup: require('!!prismjs?lang=markup!./steps/timepicker-steps.html')}
};
