import { Component } from '@angular/core';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-toast-prevent-autohide',
	standalone: true,
	imports: [NgbToastModule],
	templateUrl: './toast-prevent-autohide.html',
})
export class NgbdToastPreventAutohide {
	show = false;
	autohide = true;
}
