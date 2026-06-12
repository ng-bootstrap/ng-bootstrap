import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { NgbTimepicker } from '@ng-bootstrap/ng-bootstrap/timepicker';

@Component({
	selector: 'ngbd-timepicker-basic',
	imports: [NgbTimepicker, FormsModule, JsonPipe],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './timepicker-basic.html',
})
export class NgbdTimepickerBasic {
	time = { hour: 13, minute: 30 };
}
