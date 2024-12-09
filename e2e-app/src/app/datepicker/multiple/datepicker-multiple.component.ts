import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    imports: [FormsModule, NgbModule, JsonPipe],
    templateUrl: './datepicker-multiple.component.html'
})
export class DatepickerMultipleComponent {
	startDate = { year: 2016, month: 8 };
}
