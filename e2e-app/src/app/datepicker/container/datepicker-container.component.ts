import { Component, inject, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';

@Component({
	templateUrl: './datepicker-container.component.html',
	imports: [FormsModule, NgbInputDatepicker],
})
export class DatepickerContainerComponent {
	private readonly modalService = inject(NgbModal);

	openModal(content: TemplateRef<any>) {
		this.modalService.open(content);
	}
}
