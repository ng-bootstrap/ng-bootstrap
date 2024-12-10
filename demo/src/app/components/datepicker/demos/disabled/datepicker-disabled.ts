import { Component, inject } from '@angular/core';
import { NgbCalendar, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'ngbd-datepicker-disabled',
	imports: [NgbDatepickerModule, FormsModule],
	templateUrl: './datepicker-disabled.html',
})
export class NgbdDatepickerDisabled {
	model = inject(NgbCalendar).getToday();
	disabled = true;
}
