import { Component, inject } from '@angular/core';
import { NgbCalendar, NgbInputDatepicker, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'ngbd-datepicker-footertemplate',
	imports: [NgbInputDatepicker, FormsModule],
	templateUrl: './datepicker-footertemplate.html',
})
export class NgbdDatepickerFootertemplate {
	today = inject(NgbCalendar).getToday();
	model: NgbDateStruct;
}
