import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbTimepicker } from '@ng-bootstrap/ng-bootstrap/timepicker';

@Component({
	imports: [NgbTimepicker, FormsModule],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './timepicker-navigation.component.html',
})
export class TimepickerNavigationComponent {
	time = { hour: 13, minute: 30, second: 30 };
}
