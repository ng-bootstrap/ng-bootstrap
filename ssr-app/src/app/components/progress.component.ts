import { Component } from '@angular/core';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap/progressbar';

@Component({
	selector: 'progress-component',
	imports: [NgbProgressbar],
	template: ` <ngb-progressbar [showValue]="true" type="success" [value]="50"></ngb-progressbar> `,
})
export class ProgressComponent {}
