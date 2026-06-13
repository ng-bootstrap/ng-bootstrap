import { Component, signal } from '@angular/core';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap/toast';

@Component({
	selector: 'ngbd-toast-closeable',
	imports: [NgbToast],
	templateUrl: './toast-closeable.html',
})
export class NgbdToastCloseable {
	readonly show = signal(true);

	close() {
		this.show.set(false);
		setTimeout(() => this.show.set(true), 3000);
	}
}
