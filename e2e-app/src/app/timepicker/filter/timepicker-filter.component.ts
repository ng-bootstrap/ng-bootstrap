import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbTimepicker } from '@ng-bootstrap/ng-bootstrap/timepicker';

@Component({
	imports: [NgbTimepicker, FormsModule],
	templateUrl: './timepicker-filter.component.html',
})
export class TimepickerFilterComponent {
	time = { hour: null, minute: null, second: null };
}
