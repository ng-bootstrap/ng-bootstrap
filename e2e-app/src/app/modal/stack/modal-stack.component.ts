import { Component, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';

@Component({
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './modal-stack.component.html',
})
export class ModalStackComponent {
	constructor(private modalService: NgbModal) {}

	openModal(content: TemplateRef<any>) {
		this.modalService.open(content);
	}
}
