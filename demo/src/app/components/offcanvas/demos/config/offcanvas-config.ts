import { Component, inject, TemplateRef } from '@angular/core';
import { NgbOffcanvas, NgbOffcanvasConfig } from '@ng-bootstrap/ng-bootstrap/offcanvas';

@Component({
	selector: 'ngbd-offcanvas-config',
	templateUrl: './offcanvas-config.html',
	// add NgbOffcanvasConfig and NgbOffcanvas to the component providers
	providers: [NgbOffcanvasConfig, NgbOffcanvas],
})
export class NgbdOffcanvasConfig {
	private readonly offcanvasService = inject(NgbOffcanvas);

	constructor() {
		// customize default values of offcanvas used by this component tree
		const config = inject(NgbOffcanvasConfig);
		config.position = 'end';
		config.backdropClass = 'bg-info';
		config.keyboard = false;
	}

	open(content: TemplateRef<any>) {
		this.offcanvasService.open(content);
	}
}
