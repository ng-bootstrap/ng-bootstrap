import {Component} from '@angular/core';
import {NGB_TIMEPICKER_DIRECTIVES} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, REACTIVE_FORM_DIRECTIVES} from '@angular/forms';

@Component({
  selector: 'ngbd-timepicker-validation',
  template: require('./timepicker-validation.html'),
  directives: [NGB_TIMEPICKER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES]
})
export class NgbdTimepickerValidation {
  time;

  ctrl = new FormControl('', (control: FormControl) => {
    const value = control.value;

    if (!value) {
      return null;
    }

    if (value.hour < 12) {
      return {tooEarly: true};
    }
    if (value.hour > 13) {
      return {tooLate: true};
    }

    return null;
  });
}
