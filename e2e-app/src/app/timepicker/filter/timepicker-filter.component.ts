import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    imports: [NgbModule, FormsModule],
    templateUrl: './timepicker-filter.component.html'
})
export class TimepickerFilterComponent {
	time = { hour: null, minute: null, second: null };
}
