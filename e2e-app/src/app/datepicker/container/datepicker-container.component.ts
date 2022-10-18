import { Component, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({ templateUrl: './datepicker-container.component.html' })
export class DatepickerContainerComponent {
	constructor(private modalService: NgbModal) {}

	openModal(content: TemplateRef<any>) {
		this.modalService.open(content);
	}
}
