import { Component } from '@angular/core';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'ngbd-datepicker-positiontarget',
	standalone: true,
	imports: [NgbDatepickerModule, FormsModule],
	templateUrl: './datepicker-positiontarget.html',
})
export class NgbdDatepickerPositiontarget {
	model: NgbDateStruct;
	placement = 'bottom';
}
