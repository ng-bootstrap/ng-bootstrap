import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbTimepicker } from '@ng-bootstrap/ng-bootstrap/timepicker';
import { JsonPipe } from '@angular/common';

@Component({
	selector: 'ngbd-timepicker-meridian',
	imports: [NgbTimepicker, FormsModule, JsonPipe],
	templateUrl: './timepicker-meridian.html',
})
export class NgbdTimepickerMeridian {
	time = { hour: 13, minute: 30 };
	meridian = true;
}
