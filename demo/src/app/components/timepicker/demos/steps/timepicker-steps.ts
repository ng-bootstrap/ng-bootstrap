import { Component } from '@angular/core';
import { NgbTimepickerModule, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
	selector: 'ngbd-timepicker-steps',
	standalone: true,
	imports: [NgbTimepickerModule, FormsModule, JsonPipe],
	templateUrl: './timepicker-steps.html',
})
export class NgbdTimepickerSteps {
	time: NgbTimeStruct = { hour: 13, minute: 30, second: 0 };
	hourStep = 1;
	minuteStep = 15;
	secondStep = 30;
}
