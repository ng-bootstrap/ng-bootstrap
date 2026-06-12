import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbToast, NgbToastHeader } from '@ng-bootstrap/ng-bootstrap/toast';

@Component({
	selector: 'ngbd-toast-customheader',
	imports: [NgbToast, NgbToastHeader],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './toast-custom-header.html',
})
export class NgbdToastCustomHeader {
	show = true;
}
