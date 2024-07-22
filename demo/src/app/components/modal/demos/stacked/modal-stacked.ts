import { Component, inject } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'ngbd-modal-stacked',
	standalone: true,
	template: `
		<div class="modal-header">
			<h4 class="modal-title">Hi there!</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body">
			<p>Hello, World!</p>
			<p><button class="btn btn-lg btn-outline-primary" (click)="open()">Launch demo modal</button></p>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-outline-secondary" (click)="activeModal.close('Close click')">Close</button>
		</div>
	`,
})
export class NgbdModal1Content {
	private modalService = inject(NgbModal);
	activeModal = inject(NgbActiveModal);

	open() {
		this.modalService.open(NgbdModal2Content, { size: 'lg' });
	}
}

@Component({
	standalone: true,
	template: `
		<div class="modal-header">
			<h4 class="modal-title">Hi there!</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body">
			<p>Hello, World!</p>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-outline-secondary" (click)="activeModal.close('Close click')">Close</button>
		</div>
	`,
})
export class NgbdModal2Content {
	activeModal = inject(NgbActiveModal);
}

@Component({
	selector: 'ngbd-modal-stacked',
	standalone: true,
	templateUrl: './modal-stacked.html',
})
export class NgbdModalStacked {
	private modalService = inject(NgbModal);
	modalsNumber = 0;

	constructor() {
		this.modalService.activeInstances.pipe(takeUntilDestroyed()).subscribe((list) => {
			this.modalsNumber = list.length;
		});
	}

	open() {
		this.modalService.open(NgbdModal1Content);
	}
}
