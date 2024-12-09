import { Component } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'alert-component',
    imports: [NgbAlertModule],
    template: `
		<ngb-alert [dismissible]="false">Sample alert here</ngb-alert>
		<ngb-alert>Sample dismissible alert here</ngb-alert>
	`
})
export class AlertComponent {}
