import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker';
import { NgbDropdown, NgbDropdownMenu, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap/dropdown';

@Component({
	imports: [FormsModule, NgbInputDatepicker, NgbDropdownMenu, NgbDropdown, NgbDropdownToggle, JsonPipe],
	templateUrl: './datepicker-focus.component.html',
})
export class DatepickerFocusComponent {
	model = null;
	startDate = null;
	disabled = false;
}
