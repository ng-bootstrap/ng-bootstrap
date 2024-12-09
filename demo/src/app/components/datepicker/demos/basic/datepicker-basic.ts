import { Component, inject } from '@angular/core';
import { NgbCalendar, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'ngbd-datepicker-basic',
    imports: [NgbDatepickerModule, FormsModule, JsonPipe],
    templateUrl: './datepicker-basic.html'
})
export class NgbdDatepickerBasic {
	today = inject(NgbCalendar).getToday();

	model: NgbDateStruct;
	date: { year: number; month: number };
}
