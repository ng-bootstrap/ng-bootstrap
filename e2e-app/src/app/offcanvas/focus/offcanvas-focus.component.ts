import { Component, TemplateRef } from '@angular/core';
import { NgbModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
    imports: [FormsModule, NgbModule],
    templateUrl: './offcanvas-focus.component.html'
})
export class OffcanvasFocusComponent {
	disabledButton = false;

	constructor(private offcanvasService: NgbOffcanvas) {}

	openOffcanvas(content?: TemplateRef<any>) {
		this.offcanvasService.open(content ? content : 'Offcanvas content');
	}

	openAndDisable(content?: TemplateRef<any>) {
		this.disabledButton = true;
		this.openOffcanvas(content);
	}
}
