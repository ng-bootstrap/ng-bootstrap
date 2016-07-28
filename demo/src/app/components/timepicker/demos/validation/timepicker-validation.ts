import {Component} from '@angular/core';
import {NGB_TIMEPICKER_DIRECTIVES} from '@ng-bootstrap/ng-bootstrap';
import {Control} from '@angular/common';

const check = (c: boolean) => c ? true : undefined;

@Component({
  selector: 'ngbd-timepicker-validation',
  template: require('./timepicker-validation.html'),
  directives: [NGB_TIMEPICKER_DIRECTIVES]
})
export class NgbdTimepickerValidation {
  time;

  lunchControl = new Control('', (control: Control) => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const result = {};

    if (value.hour < 12) {
      result['tooEarly'] = true;
    }
    if (value.hour > 13) {
      result['tooLate'] = true;
    }
    if (isNaN(value.minute)) {
      result['noMinutesSet'] = true;
    }

    return Object.keys(result).length > 0 ? result : null;
  });
}
