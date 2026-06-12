import { Component } from '@angular/core';
import { NgbTimepicker, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap/timepicker';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
	selector: 'ngbd-timepicker-steps',
	imports: [NgbTimepicker, FormsModule, JsonPipe],
	templateUrl: './timepicker-steps.html',
})
export class NgbdTimepickerSteps {
	time: NgbTimeStruct = { hour: 13, minute: 30, second: 0 };
	hourStep = 1;
	minuteStep = 15;
	secondStep = 30;
}
