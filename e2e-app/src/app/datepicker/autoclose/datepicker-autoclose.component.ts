import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	imports: [FormsModule, NgbModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './datepicker-autoclose.component.html',
})
export class DatepickerAutoCloseComponent {
	autoClose: boolean | 'inside' | 'outside' = true;
	model = null;
	displayMonths = 1;
}
