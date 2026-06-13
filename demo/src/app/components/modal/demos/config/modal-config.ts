import { Component, inject } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap/modal';

@Component({
	selector: 'ngbd-modal-config',
	templateUrl: './modal-config.html',
	// add NgbModalConfig and NgbModal to the component providers
	providers: [NgbModalConfig, NgbModal],
})
export class NgbdModalConfig {
	private readonly modalService = inject(NgbModal);

	constructor() {
		// customize default values of modals used by this component tree
		const config = inject(NgbModalConfig);
		config.backdrop = 'static';
		config.keyboard = false;
	}

	open(content) {
		this.modalService.open(content);
	}
}
