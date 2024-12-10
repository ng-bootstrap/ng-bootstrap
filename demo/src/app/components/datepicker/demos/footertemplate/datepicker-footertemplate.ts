import { Component, inject } from '@angular/core';
import { NgbCalendar, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'ngbd-datepicker-footertemplate',
	imports: [NgbDatepickerModule, FormsModule],
	templateUrl: './datepicker-footertemplate.html',
})
export class NgbdDatepickerFootertemplate {
	today = inject(NgbCalendar).getToday();
	model: NgbDateStruct;
}
