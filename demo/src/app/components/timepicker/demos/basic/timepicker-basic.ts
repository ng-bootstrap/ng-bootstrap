import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-timepicker-basic',
	imports: [NgbTimepickerModule, FormsModule, JsonPipe],
	templateUrl: './timepicker-basic.html',
})
export class NgbdTimepickerBasic {
	time = { hour: 13, minute: 30 };
}
