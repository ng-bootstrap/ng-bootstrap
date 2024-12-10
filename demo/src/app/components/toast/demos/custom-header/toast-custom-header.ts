import { Component } from '@angular/core';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-toast-customheader',
	imports: [NgbToastModule],
	templateUrl: './toast-custom-header.html',
})
export class NgbdToastCustomHeader {
	show = true;
}
