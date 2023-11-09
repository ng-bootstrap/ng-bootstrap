import { Component } from '@angular/core';
import { NgbMonthpickerModule, NgbMonthStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'ngbd-monthpicker-positiontarget',
	standalone: true,
	imports: [NgbMonthpickerModule, FormsModule],
	templateUrl: './monthpicker-positiontarget.html',
})
export class NgbdMonthpickerPositiontarget {
	model: NgbMonthStruct;
	placement = 'bottom';
}
