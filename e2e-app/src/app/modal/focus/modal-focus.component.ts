import { Component, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { FormsModule } from '@angular/forms';

@Component({
	imports: [FormsModule],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './modal-focus.component.html',
})
export class ModalFocusComponent {
	disabledButton = false;

	constructor(private modalService: NgbModal) {}

	openModal(content?: TemplateRef<any>) {
		this.modalService.open(content ? content : 'Modal content');
	}

	openAndDisable(content?: TemplateRef<any>) {
		this.disabledButton = true;
		this.openModal(content);
	}
}
