import { Component } from '@angular/core';
import { NgbDateStruct, NgbMonthCalendar, NgbMonthpickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'ngbd-monthpicker-footertemplate',
	standalone: true,
	imports: [NgbMonthpickerModule, FormsModule],
	templateUrl: './monthpicker-footertemplate.html',
})
export class NgbdMonthpickerFootertemplate {
	model: NgbDateStruct;
	today = this.calendar.getToday();

	constructor(private calendar: NgbMonthCalendar) {}
}
