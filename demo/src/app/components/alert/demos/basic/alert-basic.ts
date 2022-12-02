import { Component } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-alert-basic',
	standalone: true,
	imports: [NgbAlertModule],
	templateUrl: './alert-basic.html',
})
export class NgbdAlertBasic {}
