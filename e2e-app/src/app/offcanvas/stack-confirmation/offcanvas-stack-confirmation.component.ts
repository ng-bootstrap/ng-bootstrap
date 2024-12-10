import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
	imports: [NgbModule],
	templateUrl: './offcanvas-stack-confirmation.component.html',
})
export class OffcanvasStackConfirmationComponent {
	@ViewChild('confirmation', { static: true, read: TemplateRef }) confirmationTpl: TemplateRef<any>;

	constructor(
		private modalService: NgbModal,
		private offcanvasService: NgbOffcanvas,
	) {}

	openOffcanvas(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { beforeDismiss: () => this.modalService.open(this.confirmationTpl).result });
	}
}
