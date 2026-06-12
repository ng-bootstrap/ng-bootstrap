import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap/modal';

@Component({
	selector: 'ngbd-modal-config',
	templateUrl: './modal-config.html',
	// add NgbModalConfig and NgbModal to the component providers
	changeDetection: ChangeDetectionStrategy.Eager,
	providers: [NgbModalConfig, NgbModal],
})
export class NgbdModalConfig {
	constructor(
		config: NgbModalConfig,
		private modalService: NgbModal,
	) {
		// customize default values of modals used by this component tree
		config.backdrop = 'static';
		config.keyboard = false;
	}

	open(content) {
		this.modalService.open(content);
	}
}
