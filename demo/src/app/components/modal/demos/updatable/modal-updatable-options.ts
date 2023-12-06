import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-modal-updatable-options',
	standalone: true,
	template: `
		<div class="modal-header">
			<h4 class="modal-title">Hi there!</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body">
			<p>Hello, {{ name }}!</p>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-outline-secondary" (click)="activeModal.update({ size: 'xl' })">
				Update size
			</button>
			<button type="button" class="btn btn-outline-secondary" (click)="activeModal.update({ centered: true })">
				Update centered
			</button>
			<button
				type="button"
				class="btn btn-outline-secondary"
				(click)="activeModal.update({ backdropClass: 'light-blue-backdrop' })"
			>
				Update backdropClass
			</button>
			<button type="button" class="btn btn-outline-secondary" (click)="activeModal.update({ fullscreen: true })">
				Update fullscreen
			</button>

			<button type="button" class="btn btn-outline-secondary" (click)="activeModal.close('Close click')">Close</button>
		</div>
	`,
})
export class NgbdModalContent {
	activeModal = inject(NgbActiveModal);
	@Input() name: string;
}

@Component({
	selector: 'ngbd-modal-updatable-component',
	standalone: true,
	templateUrl: './modal-updatable-options.html',
})
export class NgbdModalUpdatableOptions {
	private modalService = inject(NgbModal);

	open() {
		const modalRef = this.modalService.open(NgbdModalContent);
		modalRef.componentInstance.name = 'World';
	}
}
