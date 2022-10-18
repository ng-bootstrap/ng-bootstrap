import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-timepicker-validation',
	templateUrl: './timepicker-validation.html',
})
export class NgbdTimepickerValidation {
	ctrl = new FormControl<NgbTimeStruct | null>(null, (control: FormControl<NgbTimeStruct | null>) => {
		const value = control.value;

		if (!value) {
			return null;
		}

		if (value.hour < 12) {
			return { tooEarly: true };
		}
		if (value.hour > 13) {
			return { tooLate: true };
		}

		return null;
	});
}
