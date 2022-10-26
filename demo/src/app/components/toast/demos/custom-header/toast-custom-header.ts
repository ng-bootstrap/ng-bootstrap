import { Component } from '@angular/core';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIf } from '@angular/common';

@Component({
	selector: 'ngbd-toast-customheader',
	standalone: true,
	imports: [NgbToastModule, NgIf],
	templateUrl: './toast-custom-header.html',
})
export class NgbdToastCustomHeader {
	show = true;
}
