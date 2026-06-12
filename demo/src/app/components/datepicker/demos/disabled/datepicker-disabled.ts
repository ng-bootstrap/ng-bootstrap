import { Component, inject } from '@angular/core';
import { NgbCalendar, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'ngbd-datepicker-disabled',
	imports: [NgbDatepicker, FormsModule],
	templateUrl: './datepicker-disabled.html',
})
export class NgbdDatepickerDisabled {
	model = inject(NgbCalendar).getToday();
	disabled = true;
}
