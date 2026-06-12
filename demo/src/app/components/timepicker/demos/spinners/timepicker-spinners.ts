import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbTimepicker } from '@ng-bootstrap/ng-bootstrap/timepicker';

@Component({
	selector: 'ngbd-timepicker-spinners',
	imports: [NgbTimepicker, FormsModule],
	templateUrl: './timepicker-spinners.html',
})
export class NgbdTimepickerSpinners {
	time = { hour: 13, minute: 30 };
	spinners = true;
}
