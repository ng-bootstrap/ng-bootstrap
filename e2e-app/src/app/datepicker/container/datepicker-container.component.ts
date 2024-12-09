import { Component, TemplateRef } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
    templateUrl: './datepicker-container.component.html',
    imports: [FormsModule, NgbModule]
})
export class DatepickerContainerComponent {
	constructor(private modalService: NgbModal) {}

	openModal(content: TemplateRef<any>) {
		this.modalService.open(content);
	}
}
