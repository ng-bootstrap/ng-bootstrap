import { Component, inject, Input } from '@angular/core';
import { NgbActiveOffcanvas, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-offcanvas-content',
	standalone: true,
	template: `
		<div class="offcanvas-header">
			<h5 class="offcanvas-title">Offcanvas</h5>
			<button
				type="button"
				class="btn-close text-reset"
				aria-label="Close"
				(click)="activeOffcanvas.dismiss('Cross click')"
			></button>
		</div>
		<div class="offcanvas-body">
			<div>Hello {{ name }}</div>
			<button type="button" class="btn btn-outline-secondary" (click)="activeOffcanvas.close('Close click')">
				Close
			</button>
		</div>
	`,
	styles: `
		/* Opening offcanvas as a component requires this style in order to scroll */
		:host {
			height: 100%;
			display: flex;
			flex-direction: column;
		}
	`,
})
export class NgbdOffcanvasContent {
	activeOffcanvas = inject(NgbActiveOffcanvas);
	@Input() name: string;
}

@Component({
	selector: 'ngbd-offcanvas-component',
	standalone: true,
	templateUrl: './offcanvas-component.html',
})
export class NgbdOffcanvasComponent {
	private offcanvasService = inject(NgbOffcanvas);

	open() {
		const offcanvasRef = this.offcanvasService.open(NgbdOffcanvasContent);
		offcanvasRef.componentInstance.name = 'World';
	}
}
