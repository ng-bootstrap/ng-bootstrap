import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	standalone: true,
	imports: [FormsModule, NgbModule, JsonPipe],
	templateUrl: './datepicker-focus.component.html',
})
export class DatepickerFocusComponent {
	model = null;
	startDate = null;
	disabled = false;
}
