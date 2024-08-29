import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	standalone: true,
	templateUrl: './modal-role.component.html',
})
export class ModalRoleComponent {
	constructor(private modalService: NgbModal) {}

	openModal(role?: string) {
		this.modalService.open('Modal content', role ? { role } : undefined);
	}
}
