import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	standalone: true,
	imports: [NgbModule, FormsModule],
	templateUrl: './timepicker-navigation.component.html',
})
export class TimepickerNavigationComponent {
	time = { hour: 13, minute: 30, second: 30 };
}
