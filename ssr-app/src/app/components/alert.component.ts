import { Component } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap/alert';

@Component({
	selector: 'alert-component',
	imports: [NgbAlert],
	template: `
		<ngb-alert [dismissible]="false">Sample alert here</ngb-alert>
		<ngb-alert>Sample dismissible alert here</ngb-alert>
	`,
})
export class AlertComponent {}
