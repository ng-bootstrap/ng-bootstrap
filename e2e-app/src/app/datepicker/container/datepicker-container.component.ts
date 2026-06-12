import { Component, inject, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';

@Component({
	templateUrl: './datepicker-container.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	imports: [FormsModule, NgbInputDatepicker],
})
export class DatepickerContainerComponent {
	private readonly modalService = inject(NgbModal);

	openModal(content: TemplateRef<any>) {
		this.modalService.open(content);
	}
}
