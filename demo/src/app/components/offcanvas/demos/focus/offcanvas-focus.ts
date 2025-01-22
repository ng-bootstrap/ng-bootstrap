import { Component, inject } from '@angular/core';
import { NgbActiveOffcanvas, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-offcanvas-firstfocus',
	template: `
		<div class="offcanvas-header">
			<h4 class="offcanvas-title">Offcanvas title</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="offcanvas.dismiss('Cross click')"></button>
		</div>
		<div class="offcanvas-body">
			<p>One fine body&hellip;</p>
			<div class="text-end">
				<button type="button" class="btn btn-outline-secondary" (click)="offcanvas.close('OK click')">OK</button>
			</div>
		</div>
	`,
})
export class NgbdOffcanvasFirstFocus {
	offcanvas = inject(NgbActiveOffcanvas);
}

@Component({
	selector: 'ngbd-offcanvas-autofocus',
	template: `
		<div class="offcanvas-header">
			<h4 class="offcanvas-title">Offcanvas title</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="offcanvas.dismiss('Cross click')"></button>
		</div>
		<div class="offcanvas-body">
			<p>One fine body&hellip;</p>
			<div class="text-end">
				<button ngbAutofocus type="button" class="btn btn-outline-secondary" (click)="offcanvas.close('OK click')">
					OK
				</button>
			</div>
		</div>
	`,
})
export class NgbdOffcanvasAutoFocus {
	offcanvas = inject(NgbActiveOffcanvas);
}

@Component({
	selector: 'ngbd-offcanvas-focus',
	templateUrl: './offcanvas-focus.html',
})
export class NgbdOffcanvasFocus {
	private offcanvasService = inject(NgbOffcanvas);

	openFirstFocus() {
		this.offcanvasService.open(NgbdOffcanvasFirstFocus);
	}

	openAutoFocus() {
		this.offcanvasService.open(NgbdOffcanvasAutoFocus);
	}
}
