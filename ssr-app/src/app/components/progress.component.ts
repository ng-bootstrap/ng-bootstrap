import { Component } from '@angular/core';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'progress-component',
	standalone: true,
	imports: [NgbProgressbarModule],
	template: ` <ngb-progressbar [showValue]="true" type="success" [value]="50"></ngb-progressbar> `,
})
export class ProgressComponent {}
