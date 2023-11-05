import { Component } from '@angular/core';
import { NgbMonthCalendar, NgbMonthpickerModule, NgbMonthStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
	selector: 'ngbd-monthpicker-basic',
	standalone: true,
	imports: [NgbMonthpickerModule, FormsModule, JsonPipe],
	templateUrl: './monthpicker-basic.html',
})
export class NgbdMonthpickerBasic {
	model: NgbMonthStruct;
	date: { year: number; month: number };

	constructor(private calendar: NgbMonthCalendar) {}

	selectToday() {
		this.model = this.calendar.getToday();
	}
}
