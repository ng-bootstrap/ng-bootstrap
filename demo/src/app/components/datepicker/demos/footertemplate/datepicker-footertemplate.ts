import { Component } from '@angular/core';
import { NgbCalendar, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'ngbd-datepicker-footertemplate',
	standalone: true,
	imports: [NgbDatepickerModule, FormsModule],
	templateUrl: './datepicker-footertemplate.html',
})
export class NgbdDatepickerFootertemplate {
	model: NgbDateStruct;
	today = this.calendar.getToday();

	constructor(private calendar: NgbCalendar) {}
}
