import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdown, NgbDropdownMenu, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap/dropdown';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker';

@Component({
	imports: [FormsModule, NgbDropdownMenu, NgbDropdown, NgbDropdownToggle, NgbInputDatepicker],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './datepicker-autoclose.component.html',
})
export class DatepickerAutoCloseComponent {
	autoClose: boolean | 'inside' | 'outside' = true;
	model = null;
	displayMonths = 1;
}
