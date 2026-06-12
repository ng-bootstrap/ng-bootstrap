import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbInputDatepicker, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'ngbd-datepicker-positiontarget',
	imports: [NgbInputDatepicker, FormsModule],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './datepicker-positiontarget.html',
})
export class NgbdDatepickerPositiontarget {
	model: NgbDateStruct;
	placement = 'bottom';
}
