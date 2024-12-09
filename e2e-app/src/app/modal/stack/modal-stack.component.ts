import { Component, TemplateRef } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    imports: [NgbModule],
    templateUrl: './modal-stack.component.html'
})
export class ModalStackComponent {
	constructor(private modalService: NgbModal) {}

	openModal(content: TemplateRef<any>) {
		this.modalService.open(content);
	}
}
