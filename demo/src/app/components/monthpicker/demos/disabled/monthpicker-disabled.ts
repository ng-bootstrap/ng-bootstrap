import { Component } from '@angular/core';
import { NgbCalendar, NgbMonthpickerModule, NgbMonthStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'ngbd-monthpicker-disabled',
	standalone: true,
	imports: [NgbMonthpickerModule, FormsModule],
	templateUrl: './monthpicker-disabled.html',
})
export class NgbdMonthpickerDisabled {
	model: NgbMonthStruct;
	disabled = true;

	constructor(calendar: NgbCalendar) {
		this.model = calendar.getToday();
	}
}
