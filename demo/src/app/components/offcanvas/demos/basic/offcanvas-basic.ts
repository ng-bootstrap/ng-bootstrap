import { Component, inject, signal, TemplateRef, WritableSignal } from '@angular/core';

import { NgbDatepickerModule, NgbOffcanvas, OffcanvasDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-offcanvas-basic',
	imports: [NgbDatepickerModule],
	templateUrl: './offcanvas-basic.html',
})
export class NgbdOffcanvasBasic {
	private offcanvasService = inject(NgbOffcanvas);
	closeResult: WritableSignal<string> = signal('');

	open(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' }).result.then(
			(result) => {
				this.closeResult.set(`Closed with: ${result}`);
			},
			(reason) => {
				this.closeResult.set(`Dismissed ${this.getDismissReason(reason)}`);
			},
		);
	}

	private getDismissReason(reason: any): string {
		switch (reason) {
			case OffcanvasDismissReasons.ESC:
				return 'by pressing ESC';
			case OffcanvasDismissReasons.BACKDROP_CLICK:
				return 'by clicking on the backdrop';
			default:
				return `with: ${reason}`;
		}
	}
}
