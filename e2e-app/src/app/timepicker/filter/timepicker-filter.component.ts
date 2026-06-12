import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbTimepicker } from '@ng-bootstrap/ng-bootstrap/timepicker';

@Component({
	imports: [NgbTimepicker, FormsModule],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './timepicker-filter.component.html',
})
export class TimepickerFilterComponent {
	time = { hour: null, minute: null, second: null };
}
