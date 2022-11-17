import { Component } from '@angular/core';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIf } from '@angular/common';

@Component({
	selector: 'ngbd-toast-inline',
	standalone: true,
	imports: [NgbToastModule, NgIf],
	templateUrl: './toast-inline.html',
})
export class NgbdToastInline {
	show = true;
}
