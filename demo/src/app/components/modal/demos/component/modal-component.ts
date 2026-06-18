import { Component, inject, input, inputBinding, model, output, outputBinding, signal, twoWayBinding } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';

@Component({
	selector: 'ngbd-modal-content',
	imports: [FormsModule],
	template: `
		<div class="modal-header">
			<h4 class="modal-title">Hi there!</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body">
			<p>Hello, {{ name() }}!</p>

			<div class="d-flex gap-2">
				<input class="form-control" [(ngModel)]="response" placeholder="Write a response" />
				<button class="btn btn-primary" (click)="send.emit(response())">Send</button>
			</div>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-outline-secondary" (click)="activeModal.close('Close click')">Close</button>
		</div>
	`,
})
export class NgbdModalContent {
	activeModal = inject(NgbActiveModal);

	readonly name = input.required<string>();
	readonly response = model.required<string>();
	readonly send = output<string>();
}

@Component({
	selector: 'ngbd-modal-component',
	templateUrl: './modal-component.html',
})
export class NgbdModalComponent {
	private modalService = inject(NgbModal);

	readonly response = signal('');

	open() {
		this.modalService.open(NgbdModalContent, {
			bindings: [
				inputBinding('name', () => 'World'),
				twoWayBinding('response', this.response),
				outputBinding('send', (value) => console.log('Response sent: ' + value)),
			]
		});
	}
}
