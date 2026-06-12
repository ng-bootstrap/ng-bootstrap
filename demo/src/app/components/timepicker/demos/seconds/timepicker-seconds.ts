import { Component } from '@angular/core';
import { NgbTimepicker, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap/timepicker';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
	selector: 'ngbd-timepicker-seconds',
	imports: [NgbTimepicker, FormsModule, JsonPipe],
	templateUrl: './timepicker-seconds.html',
})
export class NgbdTimepickerSeconds {
	time: NgbTimeStruct = { hour: 13, minute: 30, second: 30 };
	seconds = true;
}
