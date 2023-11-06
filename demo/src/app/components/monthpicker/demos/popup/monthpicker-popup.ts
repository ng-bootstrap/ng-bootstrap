import { Component } from '@angular/core';
import { NgbAlertModule, NgbMonthStruct, NgbMonthpickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
	selector: 'ngbd-monthpicker-popup',
	standalone: true,
	imports: [NgbMonthpickerModule, NgbAlertModule, FormsModule, JsonPipe],
	templateUrl: './monthpicker-popup.html',
})
export class NgbdMonthpickerPopup {
	model: NgbMonthStruct;
}
