import { Component } from '@angular/core';
import { NgbToast, NgbToastHeader } from '@ng-bootstrap/ng-bootstrap/toast';

@Component({
	selector: 'ngbd-toast-customheader',
	imports: [NgbToast, NgbToastHeader],
	templateUrl: './toast-custom-header.html',
})
export class NgbdToastCustomHeader {
	show = true;
}
