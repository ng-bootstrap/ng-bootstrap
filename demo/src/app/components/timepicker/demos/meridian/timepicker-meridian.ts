import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { JsonPipe } from '@angular/common';

@Component({
	selector: 'ngbd-timepicker-meridian',
	standalone: true,
	imports: [NgbTimepickerModule, FormsModule, JsonPipe],
	templateUrl: './timepicker-meridian.html',
})
export class NgbdTimepickerMeridian {
	time = { hour: 13, minute: 30 };
	meridian = true;

	toggleMeridian() {
		this.meridian = !this.meridian;
	}
}
