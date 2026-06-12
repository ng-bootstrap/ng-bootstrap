import { Component } from '@angular/core';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap/toast';

@Component({
	selector: 'ngbd-toast-prevent-autohide',
	imports: [NgbToast],
	templateUrl: './toast-prevent-autohide.html',
})
export class NgbdToastPreventAutohide {
	show = false;
	autohide = true;
}
