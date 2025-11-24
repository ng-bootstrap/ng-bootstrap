import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker';

@Component({
	imports: [FormsModule, NgbDatepicker, JsonPipe],
	templateUrl: './datepicker-multiple.component.html',
})
export class DatepickerMultipleComponent {
	startDate = { year: 2016, month: 8 };
}
