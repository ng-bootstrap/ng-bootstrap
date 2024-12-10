import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-timepicker-spinners',
	imports: [NgbTimepickerModule, FormsModule],
	templateUrl: './timepicker-spinners.html',
})
export class NgbdTimepickerSpinners {
	time = { hour: 13, minute: 30 };
	spinners = true;
}
