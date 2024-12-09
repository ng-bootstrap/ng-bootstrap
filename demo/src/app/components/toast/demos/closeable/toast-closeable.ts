import { Component } from '@angular/core';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'ngbd-toast-closeable',
    imports: [NgbToastModule],
    templateUrl: './toast-closeable.html'
})
export class NgbdToastCloseable {
	show = true;

	close() {
		this.show = false;
		setTimeout(() => (this.show = true), 3000);
	}
}
