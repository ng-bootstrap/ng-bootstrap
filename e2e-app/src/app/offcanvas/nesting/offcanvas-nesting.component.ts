import { Component, TemplateRef } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap/offcanvas';
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
	],
	templateUrl: './offcanvas-nesting.component.html',
})
export class OffcanvasNestingComponent {
	constructor(private offcanvasService: NgbOffcanvas) {}

	openOffcanvas(content: TemplateRef<any>) {
		this.offcanvasService.open(content);
	}

	search = (text$: Observable<string>) => text$.pipe(map(() => ['one', 'two', 'three']));
}
