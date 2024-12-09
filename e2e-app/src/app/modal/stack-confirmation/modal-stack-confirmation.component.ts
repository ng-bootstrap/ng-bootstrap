import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    imports: [NgbModule],
    templateUrl: './modal-stack-confirmation.component.html'
})
export class ModalStackConfirmationComponent {
	@ViewChild('confirmation', { static: true, read: TemplateRef }) confirmationTpl: TemplateRef<any>;

	constructor(private modalService: NgbModal) {}

	openModal(content: TemplateRef<any>) {
		this.modalService.open(content, { beforeDismiss: () => this.modalService.open(this.confirmationTpl).result });
	}
}
