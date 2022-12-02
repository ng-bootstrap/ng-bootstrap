import { Component } from '@angular/core';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIf } from '@angular/common';

@Component({
	selector: 'ngbd-toast-closeable',
	standalone: true,
	imports: [NgbToastModule, NgIf],
	templateUrl: './toast-closeable.html',
})
export class NgbdToastCloseable {
	show = true;

	close() {
		this.show = false;
		setTimeout(() => (this.show = true), 3000);
	}
}
