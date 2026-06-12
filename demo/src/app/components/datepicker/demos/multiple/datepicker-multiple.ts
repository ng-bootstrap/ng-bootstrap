import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDatepicker, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker';

@Component({
	selector: 'ngbd-datepicker-multiple',
	imports: [NgbDatepicker, NgbInputDatepicker, FormsModule],
	templateUrl: './datepicker-multiple.html',
	styles: `
		select.form-select {
			margin: 0.5rem 0.5rem 0 0;
			width: auto;
		}
	`,
})
export class NgbdDatepickerMultiple {
	displayMonths = 2;
	navigation = 'select';
	showWeekNumbers = false;
	outsideDays = 'visible';
}
