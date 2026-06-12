import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap/toast';

@Component({
	selector: 'ngbd-toast-closeable',
	imports: [NgbToast],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './toast-closeable.html',
})
export class NgbdToastCloseable {
	show = true;

	close() {
		this.show = false;
		setTimeout(() => (this.show = true), 3000);
	}
}
