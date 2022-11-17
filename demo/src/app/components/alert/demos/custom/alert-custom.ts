import { Component } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-alert-custom',
	standalone: true,
	imports: [NgbAlertModule],
	templateUrl: './alert-custom.html',
	styles: [
		`
			:host .alert-custom {
				color: #99004d;
				background-color: #f169b4;
				border-color: #800040;
			}
		`,
	],
})
export class NgbdAlertCustom {}
