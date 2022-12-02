import { Component } from '@angular/core';
import { NgbActiveOffcanvas, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-offcanvas-firstfocus',
	standalone: true,
	template: `
		<div class="offcanvas-header">
			<h4 class="offcanvas-title">Offcanvas title</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="offcanvas.dismiss('Cross click')"></button>
		</div>
		<div class="offcanvas-body">
			<p>One fine body&hellip;</p>
			<div class="text-end">
				<button type="button" class="btn btn-outline-dark" (click)="offcanvas.close('OK click')">OK</button>
			</div>
		</div>
	`,
})
export class NgbdOffcanvasFirstFocus {
	constructor(readonly offcanvas: NgbActiveOffcanvas) {}
}

@Component({
	selector: 'ngbd-offcanvas-autofocus',
	standalone: true,
	template: `
		<div class="offcanvas-header">
			<h4 class="offcanvas-title">Offcanvas title</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="offcanvas.dismiss('Cross click')"></button>
		</div>
		<div class="offcanvas-body">
			<p>One fine body&hellip;</p>
			<div class="text-end">
				<button ngbAutofocus type="button" class="btn btn-outline-dark" (click)="offcanvas.close('OK click')">
					OK
				</button>
			</div>
		</div>
	`,
})
export class NgbdOffcanvasAutoFocus {
	constructor(readonly offcanvas: NgbActiveOffcanvas) {}
}

@Component({ selector: 'ngbd-offcanvas-focus', standalone: true, templateUrl: './offcanvas-focus.html' })
export class NgbdOffcanvasFocus {
	constructor(private offcanvasService: NgbOffcanvas) {}

	openFirstFocus() {
		this.offcanvasService.open(NgbdOffcanvasFirstFocus);
	}

	openAutoFocus() {
		this.offcanvasService.open(NgbdOffcanvasAutoFocus);
	}
}
