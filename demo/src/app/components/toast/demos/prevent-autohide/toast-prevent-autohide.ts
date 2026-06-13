import { Component, signal } from '@angular/core';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap/toast';

@Component({
	selector: 'ngbd-toast-prevent-autohide',
	imports: [NgbToast],
	templateUrl: './toast-prevent-autohide.html',
})
export class NgbdToastPreventAutohide {
	readonly show = signal(false);
	readonly autohide = signal(true);
}
