import { Component } from '@angular/core';
import { NgbCalendar, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'ngbd-datepicker-disabled',
	standalone: true,
	imports: [NgbDatepickerModule, FormsModule],
	templateUrl: './datepicker-disabled.html',
})
export class NgbdDatepickerDisabled {
	model: NgbDateStruct;
	disabled = true;

	constructor(calendar: NgbCalendar) {
		this.model = calendar.getToday();
	}
}
