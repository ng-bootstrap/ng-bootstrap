import { Component } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap/alert';

@Component({
	selector: 'ngbd-alert-custom',
	imports: [NgbAlert],
	templateUrl: './alert-custom.html',
	styles: `
			.alert-custom {
				color: #99004d;
				background-color: #f169b4;
				border-color: #800040;
			}
		`,
})
export class NgbdAlertCustom {}
