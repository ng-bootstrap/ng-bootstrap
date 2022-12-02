import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgbTimepickerModule, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { JsonPipe, NgIf } from '@angular/common';

@Component({
	selector: 'ngbd-timepicker-validation',
	standalone: true,
	imports: [NgbTimepickerModule, ReactiveFormsModule, JsonPipe, NgIf],
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
