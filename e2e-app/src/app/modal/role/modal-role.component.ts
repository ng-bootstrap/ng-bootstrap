import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';

@Component({
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './modal-role.component.html',
})
export class ModalRoleComponent {
	private readonly modalService = inject(NgbModal);

	openModal(role?: 'dialog' | 'alertdialog') {
		this.modalService.open('Modal content', role ? { role } : undefined);
	}
}
