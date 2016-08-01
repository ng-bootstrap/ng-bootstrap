import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'ngbd-timepicker-validation',
  templateUrl: './timepicker-validation.html'
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
