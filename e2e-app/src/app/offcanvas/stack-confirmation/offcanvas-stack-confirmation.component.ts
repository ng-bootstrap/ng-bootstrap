import { Component, TemplateRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap/offcanvas';

@Component({
	changeDetection: ChangeDetectionStrategy.Eager,
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
