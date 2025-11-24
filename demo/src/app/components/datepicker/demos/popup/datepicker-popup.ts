import { Component } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap/alert';
import { NgbInputDatepicker, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
	selector: 'ngbd-datepicker-popup',
	imports: [NgbInputDatepicker, NgbAlert, FormsModule, JsonPipe],
	templateUrl: './datepicker-popup.html',
})
export class NgbdDatepickerPopup {
	model: NgbDateStruct;
}
