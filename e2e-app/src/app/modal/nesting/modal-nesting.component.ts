import { Component, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker';
import {
	NgbDropdown,
	NgbDropdownItem,
	NgbDropdownButtonItem,
	NgbDropdownMenu,
	NgbDropdownModule,
	NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap/dropdown';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap/typeahead';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap/tooltip';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
	imports: [
		FormsModule,
		NgbInputDatepicker,
		NgbDropdown,
		NgbDropdownItem,
		NgbDropdownButtonItem,
		NgbDropdownMenu,
		NgbDropdownModule,
		NgbDropdownToggle,
		NgbTypeahead,
		NgbTooltip,
		NgbPopover,
	],
	templateUrl: './modal-nesting.component.html',
})
export class ModalNestingComponent {
	container: string | null = null;

	constructor(private modalService: NgbModal) {}

	openModal(content: TemplateRef<any>) {
		this.modalService.open(content);
	}

	search = (text$: Observable<string>) => text$.pipe(map(() => ['one', 'two', 'three']));
}
