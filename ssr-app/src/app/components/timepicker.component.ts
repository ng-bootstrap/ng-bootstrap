import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'timepicker-component',
    imports: [NgbTimepickerModule, FormsModule],
    template: ` <ngb-timepicker [(ngModel)]="time"></ngb-timepicker> `
})
export class TimepickerComponent {
	time = { hour: 6, minute: 5 };
}
