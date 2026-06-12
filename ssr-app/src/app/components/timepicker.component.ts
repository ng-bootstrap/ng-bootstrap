import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbTimepicker } from '@ng-bootstrap/ng-bootstrap/timepicker';

@Component({
	selector: 'timepicker-component',
	imports: [NgbTimepicker, FormsModule],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: ` <ngb-timepicker [(ngModel)]="time"></ngb-timepicker> `,
})
export class TimepickerComponent {
	time = { hour: 6, minute: 5 };
}
